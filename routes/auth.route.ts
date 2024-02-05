const express = require('express');
const authController = require('../controller/auth.controller');

const router = express.Router();

router.post('/login', authController.login_user)
router.post('/logout', authController.logout_user)

module.exports = router;