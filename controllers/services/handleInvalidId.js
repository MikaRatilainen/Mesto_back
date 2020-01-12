const mongoose = require('mongoose');

const { handleNotFound } = require('./handleNotFound');

module.exports.handleInvalidId = (id, res) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    handleNotFound(res);
  }
};
