"use strict";

const Joi = require("joi");
var promise = require("bluebird");
const { wrapValidationError } = require("./response.helper");

/**
 * @description Validate the key's of create user request body which is coming from the request.
 * @param {*} user Its request body of user
 * @param {*} response Its response
 * @returns
 */
function validateCreateUser(user, res) {
  const userSchema = Joi.object().keys({
    Name: Joi.string().required(),
    email: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    password: Joi.string().optional().allow(""),
  });
  let isValidate = userSchema.validate(user, res);
  if (isValidate.error) {
    return validationErrorResponse(isValidate.error);
  }
  return promise.resolve(user);
}

/**
 * @description Generate Error response if validation is failed
 * @param {*} error Error message
 * @returns
 */
function validationErrorResponse(error) {
  return promise.reject(
    wrapValidationError({
      validationError: [error.details[0].message],
    })
  );
}

module.exports = {
  validationErrorResponse,
  validateCreateUser,
};
