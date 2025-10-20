export class ApiError extends Error {
  statusCode;
  data;
  message;
  success;

  constructor(message, statusCode, data = null) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    this.success = false;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
