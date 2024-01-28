const asyncHandler = require('express-async-handler');
const Student = require('../Schemas/Student');
const {body,  validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');


exports.sign_up = [
    body('name').trim().escape().isLength({min:2}).withMessage("Name Should be at least 2 characters long"),
    body('studentid').trim().escape().isLength({min:12}).withMessage("Should Be A valid College Id").custom(userid => {
        return new Promise((resolve, reject) => {
            Student.findOne({studentid: userid})
            .then(idexists => {
                if (idexists) {
                    reject(new Error("Id Already Exists"))
                } else {
                    resolve(true)
                }
            })
        })
    }).withMessage("Id Already Exists"),
    body('password').isLength({min:6}).withMessage("Password should be at least 6 characters long"),
    body('confirmpassword').custom((value, {req}) => {
        return value === req.body.password
    }).withMessage("confirm password doesn't match"), 

    asyncHandler(async function(req,res,next) {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            bcrypt.hash(req.body.password, 10 , async (err , hash) => {
                const student = new Student({
                    name:req.body.name,
                    studentid: req.body.studentid,
                    password:hash
                })

                await student.save();
                res.status(200).json({status:"success"});
            })
        } else {
            const student = new Student({
                name:req.body.name,
                studentid:req.body.studentid,
            })

            res.status(200).json({
                errors:errors.array(),
                student,
            })
        }
    })
    
]