const {
  createErrorHandler,
  createResponseHandler,
  wrapValidationError,
  DUPLICATE_ERROR_KEY,
  NOT_FOUND_ERROR_KEY,
  REQUEST_NOT_COMPLETE,
  userResponse,
} = require("../helpers/response.helper");
const { validateCreateUser } = require("../helpers/users.validator");
const User = require("../models/users.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createUserObject(user) {
  if (!user.password)
    return promise.reject(
      wrapValidationError({
        password: ["Password can't be blank"],
      })
    );
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(user.password, salt);

  return {
    Name: user.Name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    password: password,
  };
}
async function createUserDetail(user) {
  let checkByEmail = await User.findOne({ email: user.email });
  if (checkByEmail)
    throw {
      type: DUPLICATE_ERROR_KEY,
      message: userResponse().USER_ALREADY_REGISTERED,
    };
  return await User.create(user);
}

function responseOnCreatedUser(response) {
  return {
    message: response?._id
      ? userResponse().USER_CREATED
      : userResponse().USER_NOT_CREATED,
    user: response?._id ? response : {},
  };
}

const createUser = async (req, res, next) => {
  const handleError = createErrorHandler(req, res, next);
  const sendResponse = createResponseHandler(req, res, 201);
  const user = req.body;

  return validateCreateUser(user, res)
    .then(createUserObject)
    .then(createUserDetail)
    .then(responseOnCreatedUser)
    .then(sendResponse)
    .catch(handleError);
};
function matchPassword(user) {
  return async function (userDetail) {
    if (!userDetail)
      throw {
        type: NOT_FOUND_ERROR_KEY,
        message: userResponse().NOT_REGISTERED,
      };
    let isValid = await isValidPassword(user.password, userDetail.password);
    if (!isValid)
      throw {
        type: NOT_FOUND_ERROR_KEY,
        message: userResponse().PASSWORD_NOT_MATCH,
      };
    return userDetail;
  };
}
async function checkUserIsValid(user) {
  const newUser = await User.findOne({ email: user.email });
  if (!newUser)
    throw {
      type: NOT_FOUND_ERROR_KEY,
      message: userResponse().EMAIL_NOT_MATCH,
    };

  const checkPassword = matchPassword(user);
  const response = await checkPassword(newUser);
  return response;
}

async function isValidPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
async function generateUserAuthToken(newUser) {
  if (!newUser)
    throw {
      type: REQUEST_NOT_COMPLETE,
      message: userResponse().INVALID_USER_TYPE,
    };
  let userTokenObject = {
    id: newUser._id,
    Name: newUser.Name,
    email: newUser.email,
    phoneNumber: newUser.phoneNumber,
  };
  return userTokenObject;
}
function createJWTToken(userTokenObject) {
  return jwt.sign(userTokenObject, process.env.JWTSCECREATE, {
    expiresIn: 259200,
  });
}
function userLogin(req, res, next) {
  const user = req.body;
  const handleError = createErrorHandler(req, res, next);
  const sendResponse = createResponseHandler(req, res, 200);
  return checkUserIsValid(user)
    .then(generateUserAuthToken)
    .then((userToken) => {
      return {
        message: userResponse().USER_LOGGEDIN,
        data: { token: createJWTToken(userToken), user: userToken },
      };
    })
    .then(sendResponse)
    .catch(handleError);
}

async function getUserProfile(req, res, next) {
  const handleError = createErrorHandler(req, res, next);
  const sendResponse = createResponseHandler(req, res, 200);
  return User.findById(req.user.id)
    .then((user) => {
      return {
        message: userResponse().USER_PROFILE,
        data: user,
      };
    })
    .then(sendResponse)
    .catch(handleError);
}

module.exports = {
  createUser,
  userLogin,
  getUserProfile,
};
