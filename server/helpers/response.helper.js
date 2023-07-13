"use strict";
const _ = require("lodash");

const VALIDATION_ERROR_KEY = "Validation Error";
const REQUEST_VALIDATION_ERROR_KEY = "Request Validation error";
const DUPLICATE_ERROR_KEY = "Duplicate Error";
const NOT_FOUND_ERROR_KEY = "Not Found Error";
const NOT_AUTHORIZED_ERROR_KEY = "Not Authorize Error";
const TOO_MANY_REQUESTS_ERROR_KEY = "Too many requests";
const VALIDATION_ERROR = "validationError";

/**
 * @description helper function for handle send response data
 */
function createResponseHandler(req, res, statusCode) {
  return function (data) {
    if (data) {
      if (statusCode) {
        res.status(statusCode);
      }
      return res.send(data);
    }
    return res.status(404).send(
      buildErrorResponse(req, {
        message: "Not found<<<responseHelper.js",
      })
    );
  };
}

/**
 * @description helper function for handle Error response to all API
 */
function createErrorHandler(req, res, next) {
  return function (error) {
    if (error) {
      const responseMessage = buildErrorResponse(req, error);
      if (error.type === VALIDATION_ERROR_KEY) {
        return res.status(400).send(responseMessage);
      } else if (error.type === NOT_FOUND_ERROR_KEY) {
        return res.status(404).send(responseMessage);
      } else if (error.type === DUPLICATE_ERROR_KEY) {
        return res.status(409).send(responseMessage);
      } else if (error.type === NOT_AUTHORIZED_ERROR_KEY) {
        return res.status(403).send(responseMessage);
      } else if (error.type === REQUEST_VALIDATION_ERROR_KEY) {
        return res.status(422).send(responseMessage);
      } else if (error.type === TOO_MANY_REQUESTS_ERROR_KEY) {
        return res.status(429).send(responseMessage);
      } else {
        return next(error);
      }
    }
  };
}

function buildErrorResponse(req, error) {
  if (error && error.type) {
    return {
      url: req.originalUrl,
      message: error.message,
      type: error.type,
    };
  }
  return { url: req.originalUrl, message: error.message };
}

function wrapValidationError(errors) {
  const stringifiedErrorMessages = stringifyErrorMessages(errors);
  return {
    type: VALIDATION_ERROR_KEY,
    message:
      Object.keys(errors)[0] == VALIDATION_ERROR
        ? errors.validationError
        : stringifiedErrorMessages,
  };
}

function stringifyErrorMessages(errors) {
  var message = "";
  return _.map(errors, function (error) {
    return message + _.head(error);
  });
}
function userResponse() {
  return {
    INVALID_VERIFICATION_LINK: "Verification link is invalid.",
    VERIFICATION_LINK_VERIFIED: "User link verified.",
    RESEND_VERIFICATION: "Resend verification mail has been sent.",
    EMAIL_NOT_MATCH: "User email does not match.",
    NOT_REGISTERED: "This user not registered.",
    PASSWORD_NOT_MATCH: "User password does not match.",
    OLD_PASSWORD_NOT_MATCH: "Old password does not match.",
    USER_CREATED: "User created scucessfully.",
    USER_NOT_CREATED: "User has not been created.",
    USER_ALREADY_REGISTERED: "User already registered.",
    EMAIL_ALREADY_USED: "This email already used.",
    USERNAME_ALREADY_REGISTERED: "Username already registered.",
    FORGET_PASSWORD_LINK: "Forget password link has been sent.",
    PASSWORD_RESET: "Password reset successfully.",
    PASSWORD_UPDATED: "Password updated succesfully.",
    INVALID_USER_TYPE: "Invalid user type.",
    USER_NOT_VERIFIED: "User has not been verified.",
    SOMETHING_WRONG: "Something went wrong.",
    UNAUTHORIZED: "Unauthorize",
    NEW_USER_CREATED: "New user created successffuly.",
    USER_LOGGEDIN: "User loggedin scucessfully.",
    USER_TOKEN_REFRESH: "User token has been refreshed.",
    USER_PROFILE_UPDATED: "User profile has been updated.",
    USER_NOT_FOUND: "User not found.",
    USER_BLOCKED: "Your account is blocked by super admin.",
    USER_DELETED: "This user deleted.",
    USER_PROFILE: "User Profile",
  };
}

module.exports = {
  createErrorHandler,
  createResponseHandler,
  wrapValidationError,
  userResponse,
  VALIDATION_ERROR_KEY,
  REQUEST_VALIDATION_ERROR_KEY,
  DUPLICATE_ERROR_KEY,
  NOT_FOUND_ERROR_KEY,
  NOT_AUTHORIZED_ERROR_KEY,
  TOO_MANY_REQUESTS_ERROR_KEY,
  VALIDATION_ERROR,
};
