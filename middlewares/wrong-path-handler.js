const NotFoundError = require('../errors/error-not-fonud');

const handleWrongPath = (req, res, next) => {
  try {
    throw new NotFoundError('Запрашиваемый ресурс не найден');
  } catch (error) {
    next(error);
  }
};

module.exports = { handleWrongPath };
