const escape = require('escape-html');

const Cards = require('../models/card');
const { checkIdValidness } = require('./services/checkIdValidness');
const { handleNotFound } = require('./services/handleNotFound');

module.exports.readCards = (req, res) => {
  Cards.find({})
    .then((cards) => {
      if (cards.length === 0) {
        handleNotFound(res);
      } else {
        res.send({ data: cards });
      }
    })
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
    .catch((err) => res.status(400).send({ message: `Произошла ошибка, ${err}` }));
};

module.exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;
  let isIdValid = await checkIdValidness(cardId);
  const { _id } = req.user;

  let isUserCardOwner = false;
  await Cards.findById(cardId)
    .then((card) => {
      if (!card) {
        isIdValid = false;
      } else {
        isUserCardOwner = String(_id) === String(card.owner);
      }
    })
    .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));

  if (isIdValid && isUserCardOwner) {
    Cards.findByIdAndRemove(cardId)
      .then(() => res.send({ message: 'данные обновлены' }))
      .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
  } else if (!isIdValid) {
    handleNotFound(res);
  } else if (!isUserCardOwner) {
    res.status(403).send({ message: 'действие недоступно пользователю' });
  }
};

module.exports.likeCard = async (req, res) => {
  const { cardId } = req.params;
  const isIdValid = await checkIdValidness(cardId);

  if (isIdValid) {
    Cards.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          handleNotFound(res);
        } else {
          res.send({ data: card });
        }
      })
      .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
  } else {
    handleNotFound(res);
  }
};

module.exports.dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  const isIdValid = await checkIdValidness(cardId);

  if (isIdValid) {
    Cards.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          handleNotFound(res);
        } else {
          res.send({ data: card });
        }
      })
      .catch((err) => res.status(500).send({ message: `Произошла ошибка, ${err}` }));
  } else {
    handleNotFound(res);
  }
};
