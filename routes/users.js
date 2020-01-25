const router = require('express').Router();
const {
  readUsers, readUser, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/', readUsers);
router.get('/:id', readUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
