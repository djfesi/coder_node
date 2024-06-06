const { ErrorCodes } = require("./errorCode");

/**
 * @type {import("express").ErrorRequestHandler}
 */
const errorHandler = (error, req, res, next) => {
  console.log(error.cause);
  switch (error.code) {
    case ErrorCodes.INVALID_TYPES_ERROR:
      res
        .status(400)
        .send({ status: "error", cause: error.cause, error: error.name });
      break;
    case ErrorCodes.PRODUCT_CREATION_ERROR:
      res
        .status(400)
        .send({
          status: "error",
          error: error.name,
          cause: error.cause,
          message: error.message,
        });
      break;
    case ErrorCodes.DATABASE_ERROR:
      res
        .status(400)
        .send({
          status: "error",
          error: error.name,
          cause: error.cause,
          message: error.message,
        });
      break;
    default:
      res.status(500).send({ status: "error", error: "Unknown" });
  }
  next();
};

module.exports = { errorHandler };
