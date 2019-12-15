const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cardsRoutes = require('./routes/cards');
const usersRoutes = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '5df698299ba1ac3bfca81ef9',
  };

  next();
});

app.use('/cards', cardsRoutes);
app.use('/users', usersRoutes);

app.use((req, res) => {
  res.status(404);
  res.send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {

});
