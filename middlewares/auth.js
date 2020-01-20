const jwt = require('jsonwebtoken');

const SECRET_KEY = 'some-secret-key';

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, SECRET_KEY);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};

module.exports = {
  SECRET_KEY,
  auth,
};
