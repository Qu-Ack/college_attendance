const express = require('express');
const authController = require('../Controllers/AuthController')
const router = express.Router()
const APIController = require('../Controllers/ApiController')

router.post('/signup', authController.sign_up);
router.post('/login', authController.login);
router.post('/teacher', APIController.verify_admin,)
router.post('/class', APIController.verify_admin, authController.teacher_signup)
router.put('/teachertoclass', APIController.ClassToTeacher)
router.get('/class/:id', APIController.verify_teacher, APIController.get_class)
router.get('/singleclass/:id', APIController.verify_teacher, APIController.get_single_class);
router.post('/teacher/signup', authController.teacher_signup);
router.post('/teacher/login', authController.teacher_login);
router.post('/class/lecture/:id', APIController.verify_teacher, APIController.post_lecture)
router.post('/attendance', APIController.verify_student, APIController.mark_attendance);
router.post('/addstudtoclass', APIController.addstud_to_class)
router.get('/student/:studid', APIController.verify_student, APIController.get_stud)
router.get("/lecture/:lectureid", APIController.verify_teacher, APIController.get_lecture)
router.post('/admin/signup', authController.admin_sign_up);
router.post('/admin/login', authController.admin_login)
// router.post('/admin/login', authController.admin_login);
router.get('/get_classes', authController.verify_admin, APIController.get_classes)
// router.get("/get_teachers", authController.verify_admin, APIController.get_teachers)
// router.get('/get_students', authController.verify_admin, APIController.get_students)

module.exports = router;