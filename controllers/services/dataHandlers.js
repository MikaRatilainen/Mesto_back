const { handleNotFound } = require('./handleNotFound');

module.exports.handleNotFound = (data, res) => {
  const isEmptyArray = data.length && data.length === 0;
  const isNull = data === null;
  const isNotFound = isEmptyArray || isNull;

  if (isNotFound) {
    handleNotFound(res);
  }

  return data;
};
