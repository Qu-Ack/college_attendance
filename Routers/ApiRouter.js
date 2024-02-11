const express = require('express');
const authController = require('../Controllers/AuthController')
const router = express.Router()
const APIController = require('../Controllers/ApiController')

router.post('/signup', authController.sign_up);
router.post('/login', authController.login);
router.post('/teacher' ,APIController.teacher )
router.post('/class', APIController.Class)
router.put('/teachertoclass', APIController.ClassToTeacher)

module.exports = router;