module.exports.handleNotFound = (res) => {
  res.status(404).send({ message: 'Ресурс не найден' });
};
