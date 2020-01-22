const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const escape = require('escape-html');

const User = require('../models/user');
const { VALIDATION_ERROR } = require('../models/services/validateService');
const { checkIdValidness } = require('./services/checkIdValidness');
const { handleNotFound } = require('./services/handleNotFound');
const { SECRET_KEY } = require('../middlewares/auth');

module.exports.readUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        handleNotFound(res);
      } else {
        res.send({ data: users });
      }
    })
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
};

module.exports.readUser = async (req, res) => {
  const { id } = req.params;
  const isIdValid = await checkIdValidness(id);

  if (isIdValid) {
    User.findById(id)
      .then((user) => {
        if (!user) {
          handleNotFound(res);
        } else {
          res.send({ data: user });
        }
      })
      .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
  } else {
    handleNotFound(res);
  }
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const escPass = escape(password);

  bcrypt.hash(escPass, 10)
    .then((hash) => User.create({
      name: escape(name),
      about: escape(about),
      avatar: escape(avatar),
      email: escape(email),
      password: hash,
    }))
    // eslint-disable-next-line no-shadow
    .then(({ password, ...restUser }) => res.send({ data: restUser }))
    .catch((err) => {
      const isValidationError = err.name.startsWith(VALIDATION_ERROR);
      if (isValidationError) {
        res.status(400).send({ message: `Произошла ошибка, ${err}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка, ${err}` });
      }
    });
};

module.exports.updateUser = async (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  const isIdValid = await checkIdValidness(_id);

  if (isIdValid) {
    User.findByIdAndUpdate(_id, {
      name: escape(name),
      about: escape(about),
    })
      .then((user) => {
        if (!user) {
          handleNotFound(res);
        } else {
          res.send({ data: user });
        }
      })
      .catch((err) => {
        const isValidationError = err.name.startsWith(VALIDATION_ERROR);
        if (isValidationError) {
          res.status(400).send({ message: `Произошла ошибка, ${err}` });
        } else {
          res.status(500).send({ message: `Произошла ошибка, ${err}` });
        }
      });
  } else {
    handleNotFound(res);
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  const isIdValid = await checkIdValidness(_id);

  if (isIdValid) {
    User.findByIdAndUpdate(_id, { avatar: escape(avatar) })
      .then((user) => {
        if (!user) {
          handleNotFound(res);
        } else {
          res.send({ data: user });
        }
      })
      .catch((err) => {
        const isValidationError = err.name.startsWith(VALIDATION_ERROR);
        if (isValidationError) {
          res.status(400).send({ message: `Произошла ошибка, ${err}` });
        } else {
          res.status(500).send({ message: `Произошла ошибка, ${err}` });
        }
      });
  } else {
    handleNotFound(res);
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      });
      res.end();
    })
    .catch(({ message }) => res.status(401).send({ message }));
};
