const asyncHandler = require('express-async-handler');
const Class = require('../Schemas/Classes')
const { body, validationResult } = require('express-validator');
const Teacher = require('../Schemas/Teacher');
const Lecture = require('../Schemas/Lecture')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const Student = require('../Schemas/Student');
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

exports.verify_teacher = async function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    const authHeader = req.headers.authorization;
    if (typeof authHeader != 'undefined') {
        const token = authHeader.split(' ')[1];
        console.log(token)
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({status: "Access is Denied"})
            }
            req.auth = user._id
            if(user.role == "teacher") {
                next();
            } else {
                res.status(403).json({status:"Forbidden"})
            }
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
            dateTime: new Date(),
            attendance:[],

        })

        const cls = await Class.findById(req.params.id).exec();
        cls.students.map((stud) => {
            lecture.attendance.push({
                student:stud,
            })
        })
        await lecture.save();
        cls.lectures.push(lecture);
        await cls.save();
        res.status(200).json({
            status: "success",
            message: "Lecture posted successfully"
        })
    })
]

exports.mark_attendance = asyncHandler(async function (req, res, next) {
    const lecture = await Lecture.findById(req.body.lectureID);

    if (!lecture) {
        return res.status(404).json({
            status: "error",
            message: "Lecture not found"
        });
    }

    const studentRecord = lecture.attendance.find(record => record.student.toString() === req.body.studentID);

    if (!studentRecord) {
        return res.status(404).json({
            status: "error",
            message: "Student not found in attendance list"
        });
    }

    studentRecord.status = "P";

    await lecture.save();

    res.status(200).json({
        status: "success",
        message: "Attendance marked successfully !!"
    });
});


exports.get_stud = asyncHandler(async function(req,res,next) {
    const stud = await Student.findById(req.params.studid).populate("classes")
    if(!stud) {
        res.status(500).json({
            status:"Error"
        })
    }

    res.status(200).json({
        stud,
    })
})

exports.verify_admin = async function(req,res,next) {
    const authHeader = req.headers.authorization;
    if (typeof authHeader != 'undefined') {
        const token = authHeader.split(' ')[1];
        console.log(token)
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({status: "Access is Denied"})
            }
            req.auth = user._id

            if(user.role == "admin") {
                next();
            } else {
                res.status(403).json({
                    status: "Forbidden"
                })
            }
            
        });
    } else {
        res.status(401).json({
            status: "Access Denied"
        })
    }
}


exports.verify_student = async function(req,res,next) {
    const authHeader = req.headers.authorization;
    if (typeof authHeader != 'undefined') {
        const token = authHeader.split(' ')[1];
        console.log(token)
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({status: "Access is Denied"})
            }
            req.auth = user._id

            if(user.role == "student") {
                next();
            } else {
                res.status(403).json({
                    status: "Forbidden"
                })
            }
            
        });
    } else {
        res.status(401).json({
            status: "Access Denied"
        })
    }
}


exports.addstud_to_class = asyncHandler(async function(req,res,next) {
    const cls = await Class.findById(req.body.classID);
    const stud = await Student.findById(req.body.studentID);

    if(!cls) {
        res.status(200).json({
            status:"Class not found"
        })
    }

    if (!stud) {
        res.status(200).json({
            status:"Student not found"
        })
    }


    cls.students.push(stud._id);
    stud.classes.push(cls._id);
    await cls.save();
    await stud.save();

    res.status(200).json({
        status:"Class Added successfully"
    })
})


// we need the object id of the teacher we want to assign the class to
// we need the object id of the class we want to assign the teacher
// we need to send both of these info to backend 
// where we will run a search for the specific teacher and update it's classes