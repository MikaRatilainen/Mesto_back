const mongoose = require('mongoose');

module.exports.checkIdValiness = async (model, id) => {
  const isValidDbId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidDbId) {
    return isValidDbId;
  }

  let hasIdInDb = true;

  await model.findById(id)
    .then((data) => {
      if (data === null) {
        throw new Error('not found');
      }
    })
    .catch(() => {
      hasIdInDb = false;
    });

  return hasIdInDb;
};
