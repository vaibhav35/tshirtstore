class CustomError extends Error {
  constructor(message, code) {
    super(message);

    // hitesh code not working instead use statusCode ?
    // this.code = code;  
    this.statusCode = code; // use statusCode or status
  }
}

module.exports = CustomError;
