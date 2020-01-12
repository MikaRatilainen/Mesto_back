const { handleNotFound } = require('./handleNotFound');

module.exports.handleNotFound = (data, res) => {
  const isArray = data.length !== undefined;
  const isNotFound = isArray ? (data.length === 0) : data === null;
  console.log('data', data);
  console.log('isArray', isArray);
  console.log('isNotFound', isNotFound);

  if (isNotFound) {
    handleNotFound(res);
  }

  return data;
};
