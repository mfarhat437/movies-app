const _ = require('lodash');
const errors = require('../helpers/errors');
const utils = require('../helpers/utils');

class BaseService {
  constructor() {
    // Errors
    this.UnauthenticatedError = errors.UnauthenticatedError;
    this.UnauthorizedError = errors.UnauthorizedError;
    this.ValidationError = errors.ValidationError;
    this.NotFoundError = errors.NotFoundError;
    this.BusinessError = errors.BusinessError;
    this.UnexpectedError = errors.UnexpectedError;
    this.utils = utils;
  }

  validateExistence(object, message) {
    if (_.isNil(object)) {
      throw new this.NotFoundError(0, message);
    }
  }
}

module.exports = BaseService;
