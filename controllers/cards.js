const Cards = require('../models/card');
const { handleNotFound } = require('./services/dataHandlers');
const { handleInvalidId } = require('./services/handleInvalidId');

module.exports.readCards = (req, res) => {
  Cards.find({})
    .then((cards) => handleNotFound(cards, res))
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  handleInvalidId(cardId, res);

  Cards.findByIdAndRemove(cardId)
    .then((card) => handleNotFound(card, res))
    .then(() => res.send({ message: 'данные обновлены' }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  handleInvalidId(cardId, res);

  Cards.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => handleNotFound(card, res))
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  handleInvalidId(cardId, res);

  Cards.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => handleNotFound(card, res))
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
};
