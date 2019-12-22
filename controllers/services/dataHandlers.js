module.exports.handleNotFound = (data, res) => {
  if (data === null) {
    res.status(404).send({ message: 'Ресурс не найден' });
  }

  return res;
};
