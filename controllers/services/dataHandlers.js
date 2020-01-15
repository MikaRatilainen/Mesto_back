const { handleNotFound } = require('./handleNotFound');

module.exports.handleEmptyData = (data, res) => {
  const isArray = data && data.length !== undefined;
  const isNotFound = isArray ? (data.length === 0) : data === null;

  if (isNotFound) {
    handleNotFound(res);
  }

  return data;
};
