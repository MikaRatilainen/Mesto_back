const mongoose = require('mongoose');
const { validateURL, handleURLError } = require('./services/validateService');

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
});

module.exports = mongoose.model('user', userSchema);
