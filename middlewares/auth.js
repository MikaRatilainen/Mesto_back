const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/error-unauthorized');
const { SECRET_KEY } = require('../consts');

const auth = (req, res, next) => {
  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, SECRET_KEY);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};

module.exports = {
  SECRET_KEY,
  auth,
};
