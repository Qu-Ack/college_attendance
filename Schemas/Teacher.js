const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
    teacherName: String,
    username: {type:String, required:true},
    password: {type:String, length:{min:6}},
    classes: [{type:Schema.Types.ObjectId, ref:"Class"}]
})

module.exports = mongoose.model("Teacher", TeacherSchema);


