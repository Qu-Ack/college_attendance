const express = require('express');
const authController = require('../Controllers/AuthController')
const router = express.Router()
const APIController = require('../Controllers/ApiController')

router.post('/signup', authController.sign_up);
router.post('/login', authController.login);
router.post('/teacher' ,APIController.teacher )
router.post('/class', APIController.Class)
router.put('/teachertoclass', APIController.ClassToTeacher)
router.get('/class/:id', APIController.get_class)
router.get('/singleclass/:id', APIController.get_single_class);
router.post('/teacher/signup', authController.teacher_signup);
router.post('/teacher/login', authController.teacher_login);

module.exports = router;