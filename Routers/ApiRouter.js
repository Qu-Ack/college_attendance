const express = require('express');
const authController = require('../Controllers/AuthController')
const router = express.Router()

router.post('/signup', authController.sign_up);
router.post('/login', authController.login);




module.exports = router;