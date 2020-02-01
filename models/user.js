const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const {
  validateURL, validateEmail, handleURLError, handleEmailError,
} = require('./services/validateService');
const UnauthorizedError = require('../errors/error-unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: validateURL,
      message: handleURLError,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validateEmail,
      message: handleEmailError,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Error();
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Error();
          }

          return user;
        });
    })
    .catch(() => {
      throw new UnauthorizedError('Неправильные почта или пароль');
    });
}

userSchema.statics.findUserByCredentials = findUserByCredentials;

module.exports = mongoose.model('user', userSchema);
