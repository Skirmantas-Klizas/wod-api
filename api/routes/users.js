const express = require('express');
const router = express.Router();
const checkAuthUser = require('../middleware/user-check-auth');
const usersController = require('../controllers/usersController');

router.get('/', checkAuthUser.auth, usersController.getAllUsers);
router.post('/login', usersController.login);
router.post('/signup', usersController.signup);
router.get('/:userId', checkAuthUser.auth, usersController.getUser);
router.patch('/:userId', checkAuthUser.auth, usersController.editUser);
router.delete('/:userId', checkAuthUser.auth, usersController.deleteUser);

module.exports = router;
