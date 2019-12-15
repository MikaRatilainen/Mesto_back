const router = require('express').Router();
const {
  createUser, readUsers, readUser, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/', readUsers);
router.get('/:id', readUser);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
