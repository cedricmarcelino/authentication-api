const express = require('express');
const userController = require('../controller/user.controller');

const router = express.Router();

router.get('/', userController.users_index);
router.post('/add', userController.users_add)
router.get('/:username', userController.users_getByUsername)

module.exports = router;