const { VALIDATION_ERROR } = require('../models/services/validateService');

const SERVER_ERROR = 500;

const errorHandler = (err, req, res, next) => {
  const isValidationError = err.name.startsWith(VALIDATION_ERROR);

  if (isValidationError) {
    res.status(400).send({ message: `Произошла ошибка, ${err}` });
  } else {
    const { statusCode = SERVER_ERROR } = err;
    const message = statusCode === SERVER_ERROR ? 'На сервере произошла ошибка' : err.message;

    res
      .status(statusCode)
      .send({ message });
  }

  next();
};

module.exports = { errorHandler };
