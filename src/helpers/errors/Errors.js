/* eslint-disable max-classes-per-file */
const ErrorCodes = require('./errorCodes');

/**
 * id: Number (Error unique id)
 * name: String (Error name)
 * status: Number (http response status)
 * message: String (Error message)
 */
class BaseError extends Error {
  constructor(
    code = 0,
    name = 'Error',
    status = 500,
    message = 'Internal server error',
  ) {
    super(message);

    this.code = code;
    this.name = name;
    this.status = status;
    this.message = message;
  }

  toJson() {
    return {
      error: this.name,
      message: this.message,
    };
  }
}

// Authentication & Authorization
class NotFoundError extends BaseError {
  constructor(code = 0, message = 'Error 404') {
    super(code, 'NotFoundError', 404, message);
  }
}

class UnauthenticatedError extends BaseError {
  constructor(code = 0, message = 'Authentication failed') {
    super(code, 'UnauthenticatedError', 401, message);
  }
}

class UnauthorizedError extends BaseError {
  constructor(code = 0, message = 'Unauthorized Access') {
    super(code, 'UnauthorizedError', 403, message);
  }
}

class ValidationError extends BaseError {
  constructor(code = 0, message = 'Bad Request') {
    super(code, 'ValidationError', 400, message);
  }
}

class UnexpectedError extends BaseError {
  constructor(code = 0, message = 'Internal Server Error 500') {
    super(code, 'UnexpectedError', 500, message);
  }
}

class PaymentError extends BaseError {
  // TODO: fix me
  // eslint-disable-next-line default-param-last
  constructor(code = 0, message = 'Payment Error', errors) {
    super(code, 'PaymentError', 400, message);
    this.errors = errors;
  }
}

class BusinessError extends BaseError {
  // TODO: fix me
  // eslint-disable-next-line default-param-last
  constructor(code = 0, message = 'Business error', errors) {
    super(code, message, errors);
  }
}

module.exports = {
  Error: BaseError,
  UnauthenticatedError,
  UnauthorizedError,
  ValidationError,
  UnexpectedError,
  NotFoundError,
  ErrorCodes,
  PaymentError,
  BusinessError,
};
