const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../data/users.json');
  const usersReader = fs.createReadStream(filePath, { encoding: 'utf8' });

  usersReader.pipe(res);
});

router.get('/:id', (req, res) => {
  const filePath = path.join(__dirname, '../data/users.json');

  fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    if (err) {
      res.send({ message: err });

      return;
    }

    const users = JSON.parse(data);
    // eslint-disable-next-line no-underscore-dangle
    const user = users.find((item) => item._id === req.params.id);

    if (user === undefined) {
      res.status(404);
      res.send({ message: 'Нет пользователя с таким id' });

      return;
    }

    res.send(user);
  });
});

module.exports = router;
