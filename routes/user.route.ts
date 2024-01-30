const express = require('express');
const userController = require('../controller/user.controller');

const router = express.Router();

router.get('/', userController.users_index);
router.post('/register', userController.users_add)

module.exports = router;