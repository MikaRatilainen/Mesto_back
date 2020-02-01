const { celebrate, Joi } = require('celebrate');

const { MONGO_OBJECT_ID_PATTERN, URL_PATTENR } = require('../consts');

const name = Joi.string().required().min(2).max(30);
const link = Joi.string().required().pattern(URL_PATTENR);

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name, link,
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(MONGO_OBJECT_ID_PATTERN),
  }),
});

module.exports = {
  validateCreateCard,
  validateCardId,
};