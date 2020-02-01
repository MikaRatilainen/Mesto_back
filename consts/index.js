const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.MONGO_OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;
module.exports.URL_PATTENR = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
module.exports.SECRET_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';