const { celebrate, Joi } = require('celebrate');

const { MONGO_OBJECT_ID_PATTERN, URL_PATTENR } = require('../consts/consts');

const name = Joi.string().required().min(2).max(30);
const about = Joi.string().required().min(2).max(30);
const avatar = Joi.string().required().pattern(URL_PATTENR);
const email = Joi.string().required().email();
const password = Joi.string().required();

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name, about, avatar, email, password,
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email, password,
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name, about,
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar,
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().pattern(MONGO_OBJECT_ID_PATTERN),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUpdateUser,
  validateUserId,
  validateUpdateAvatar,
};
