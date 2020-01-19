const escape = require('escape-html');

const Cards = require('../models/card');
const User = require('../models/user');
const { handleEmptyData } = require('./services/dataHandlers');
const { checkIdValiness } = require('./services/checkIdValiness');
const { handleNotFound } = require('./services/handleNotFound');

module.exports.readCards = (req, res) => {
  Cards.find({})
    .then((cards) => handleEmptyData(cards, res))
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Cards.create({
    name: escape(name),
    link: escape(link),
    owner: req.user._id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
};

module.exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;
  const isIdValid = await checkIdValiness(Cards, cardId);
  const { _id } = req.user;

  let isUserCardOwner = false;
  User.findById(_id)
    .then((user) => {
      isUserCardOwner = _id === user._id;
    })
    .catch(() => res.status(403).sned({ message: 'действие недоступно пользователю' }));

  if (isIdValid && isUserCardOwner) {
    Cards.findByIdAndRemove(cardId)
      .then((card) => handleEmptyData(card, res))
      .then(() => res.send({ message: 'данные обновлены' }))
      .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
  } else if (!isIdValid) {
    handleNotFound(res);
  } else if (!isUserCardOwner) {
    res.status(403).sned({ message: 'действие недоступно пользователю' });
  }
};

module.exports.likeCard = async (req, res) => {
  const { cardId } = req.params;
  const isIdValid = await checkIdValiness(Cards, cardId);

  if (isIdValid) {
    Cards.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => handleEmptyData(card, res))
      .then((card) => res.send({ data: card }))
      .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
  } else {
    handleNotFound(res);
  }
};

module.exports.dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  const isIdValid = await checkIdValiness(Cards, cardId);

  if (isIdValid) {
    Cards.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => handleEmptyData(card, res))
      .then((card) => res.send({ data: card }))
      .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
  } else {
    handleNotFound(res);
  }
};
