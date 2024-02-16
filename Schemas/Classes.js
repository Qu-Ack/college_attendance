const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ClassesSchema = new Schema({
    className: String,
    classCode: {type:String, unique:true},
    students: [{type:Schema.Types.ObjectId, ref: 'student'}],
    lectures: [{type:Schema.Types.ObjectId, ref: 'Lecture'}],
    teacher: {type:Schema.Types.ObjectId, ref:"Teacher"}, 
})


module.exports = mongoose.model('Class', ClassesSchema);    