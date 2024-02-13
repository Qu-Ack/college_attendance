const asyncHandler = require('express-async-handler');
const Class = require('../Schemas/Classes')
const { body, validationResult } = require('express-validator');
const Teacher = require('../Schemas/Teacher');
const Lecture = require('../Schemas/Lecture')
const mongoose = require('mongoose')
exports.teacher = [
    body('teacherName').trim().escape().isLength({ min: 3 }),
    body("username").trim().escape(),
    body("password"),

    asyncHandler(async function (req, res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(200).json({
                errors,
            })
        } else {
            const teacher = new Teacher({
                teacherName: req.body.teacherName,
                username: req.body.username,
                password: req.body.password,
            })

            await teacher.save();

            res.status(200).json({
                status: "success",
                message: "Teacher created successfully"
            })
        }
    })

]

exports.verifyToken = async function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    const authHeader = req.headers.authorization;
    if (typeof authHeader != 'undefined') {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                next();
            }
            next()
        });
    } else {
        res.status(401).json({
            status: "Access Denied"
        })
    }
}


exports.ClassToTeacher = asyncHandler(async function (req, res, next) {
    try {

        const teacher = await Teacher.findById(req.body.teacherID);
        const cls = await Class.findById(req.body.classID);

        console.log(teacher)
        console.log(cls)

        if (!teacher || !cls) {
            res.status(200).json({
                message: "Couldn't find teacher or class"
            })
        }

        teacher.classes.push(cls._id);
        cls.teacher = teacher._id;
        await Promise.all([await teacher.save(), await cls.save()])

        res.status(200).json({
            status: "success",
            message: "teacher assigned to the class"
        })
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }


})

exports.get_single_class = asyncHandler(async function (req, res, next) {
    const cls = await Class.findById(req.params.id).populate("teacher").populate("lectures").exec();
    if (!cls) {
        res.status(500).json({
            error: "An Error Occured"
        })
    }

    res.status(200).json({
        cls
    })
})

exports.Class = [
    body("className").trim().escape(),
    body("classCode").trim().escape(),


    asyncHandler(async function (req, res, next) {
        const cls = new Class({
            className: req.body.className,
            classCode: req.body.classCode
        })

        await cls.save();

        res.status(200).json({
            status: "success",
            message: "class create successfully"
        })
    })
]

exports.get_class = asyncHandler(async function (req, res, next) {
    const classes = await Class.find({ teacher: req.params.id }).exec();
    // console.log(classes)
    res.status(200).json({
        classes
    })
})


exports.post_lecture = [
    body("lecture_name").trim().escape(),

    asyncHandler(async function (req, res, next) {
        const lecture = new Lecture({
            lectureName: req.body.lecture_name,
            class: req.params.id,
            dateTime: new Date()
        })

        const cls = await Class.findById(req.params.id).exec();

        await lecture.save();
        cls.lectures.push(lecture);
        await cls.save();
        res.status(200).json({
            status: "success",
            message: "Lecture posted successfully"
        })
    })
]
// we need the object id of the teacher we want to assign the class to
// we need the object id of the class we want to assign the teacher
// we need to send both of these info to backend 
// where we will run a search for the specific teacher and update it's classes