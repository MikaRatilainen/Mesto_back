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
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
};

module.exports.updateUser = async (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  const isIdValid = await checkIdValiness(User, _id);

  if (isIdValid) {
    User.findByIdAndUpdate(_id, { name, about })
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
    User.findByIdAndUpdate(_id, { avatar })
      .then((user) => handleEmptyData(user, res))
      .then((user) => res.send({ data: user }))
      .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
  } else {
    handleNotFound(res);
  }
};
