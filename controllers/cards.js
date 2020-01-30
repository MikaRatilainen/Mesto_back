const escape = require('escape-html');

const Cards = require('../models/card');
const NotFoundError = require('../errors/error-not-fonud');
const ForbiddenError = require('../errors/error-forbidden');

module.exports.readCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Ресурс не найден');
      }

      res.send({ data: cards });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Cards.create({
    name: escape(name),
    link: escape(link),
    owner: req.user._id,
  })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;

  const { _id } = req.user;
  let isUserCardOwner = false;
  await Cards.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      isUserCardOwner = String(_id) === String(card.owner);
    })
    .catch(next);

  if (isUserCardOwner) {
    Cards.findByIdAndRemove(cardId)
      .then(() => res.send({ message: 'данные обновлены' }))
      .catch(next);
  } else if (!isUserCardOwner) {
    throw new ForbiddenError('Недостаточно прав для удаления');
  }
};

module.exports.likeCard = async (req, res, next) => {
  const { cardId } = req.params;

  Cards.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.send({ data: card });
    })
    .catch(next);
};

module.exports.dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;

  Cards.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.send({ data: card });
    })
    .catch(next);
};
