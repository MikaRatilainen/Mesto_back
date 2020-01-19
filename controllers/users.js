const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const escape = require('escape-html');

const User = require('../models/user');
const { handleEmptyData } = require('./services/dataHandlers');
const { checkIdValiness } = require('./services/checkIdValiness');
const { handleNotFound } = require('./services/handleNotFound');

module.exports.readUsers = (req, res) => {
  User.find({})
    .then((users) => handleEmptyData(users, res))
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
};

module.exports.readUser = async (req, res) => {
  const { id } = req.params;
  const isIdValid = await checkIdValiness(User, id);

  if (isIdValid) {
    User.findById(id)
      .then((user) => handleEmptyData(user, res))
      .then((user) => res.send({ data: user }))
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
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
};

module.exports.updateUser = async (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  const isIdValid = await checkIdValiness(User, _id);

  if (isIdValid) {
    User.findByIdAndUpdate(_id, {
      name: escape(name),
      about: escape(about),
    })
      .then((user) => handleEmptyData(user, res))
      .then((user) => res.send({ data: user }))
      .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
  } else {
    handleNotFound(res);
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  const isIdValid = await checkIdValiness(User, _id);

  if (isIdValid) {
    User.findByIdAndUpdate(_id, { avatar: escape(avatar) })
      .then((user) => handleEmptyData(user, res))
      .then((user) => res.send({ data: user }))
      .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
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
        'some-secret-key',
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
