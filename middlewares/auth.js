const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, 'some-secret-key');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
