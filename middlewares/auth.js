const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/error-unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;
const SECRET_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

// eslint-disable-next-line consistent-return
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
