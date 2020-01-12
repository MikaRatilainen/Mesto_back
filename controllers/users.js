const User = require('../models/user');
const { handleNotFound } = require('./services/dataHandlers');
const { handleInvalidId } = require('./services/handleInvalidId');

module.exports.readUsers = (req, res) => {
  User.find({})
    .then((users) => handleNotFound(users, res))
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
};

module.exports.readUser = (req, res) => {
  const { id } = req.params;
  handleInvalidId(id, res);

  User.findById(id)
    .then((user) => handleNotFound(user, res))
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  handleInvalidId(_id, res);

  User.findByIdAndUpdate(_id, { name, about })
    .then((user) => handleNotFound(user, res))
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  handleInvalidId(_id, res);

  User.findByIdAndUpdate(_id, { avatar })
    .then((user) => handleNotFound(user, res))
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
};
