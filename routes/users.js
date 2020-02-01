const router = require('express').Router();

const {
  readUsers, readUser, updateUser, updateUserAvatar,
} = require('../controllers/users');
const { validateUserId, validateUpdateUser, validateUpdateAvatar } = require('../middlewares/user-request-validation');

router.get('/', readUsers);
router.get('/:id', validateUserId, readUser);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateUserAvatar);

module.exports = router;
