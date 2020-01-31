const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const escape = require('escape-html');

const User = require('../models/user');
const { SECRET_KEY } = require('../middlewares/auth');
const NotFoundError = require('../errors/error-not-fonud');

module.exports.readUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Ресурс не найден');
      }

      res.send({ data: users });
    })
    .catch(next);
};

module.exports.readUser = async (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
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
    .then(({ _doc: { password, __v, ...restUser } }) => res.send({ data: restUser }))
    .catch(next);
};

module.exports.updateUser = async (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, {
    name: escape(name),
    about: escape(about),
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

module.exports.updateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar: escape(avatar) })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

module.exports.login = async (req, res, next) => {
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
    .catch(next);
};
