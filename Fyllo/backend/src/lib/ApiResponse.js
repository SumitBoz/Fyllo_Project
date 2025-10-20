export class ApiResponse {
  statusCode;
  data;
  success;
  message;

  constructor(message, statusCode, data = null) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    this.success = statusCode < 400;
  }
}
