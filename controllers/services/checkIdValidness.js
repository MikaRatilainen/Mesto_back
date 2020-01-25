const mongoose = require('mongoose');

module.exports.checkIdValidness = async (id) => mongoose.Types.ObjectId.isValid(id);
