class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statuCode = statusCode;
  }
}

export default HttpError;
