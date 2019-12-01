const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../data/cards.json');
  const cardsReader = fs.createReadStream(filePath, { encoding: 'utf8' });

  cardsReader.pipe(res);
});

module.exports = router;
