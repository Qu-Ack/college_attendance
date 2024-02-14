const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const StudentSchema = new Schema({
    name: {type:String, required:true, length:{min:2}},
    studentid: {type:String, required:true, length:{min:12}},
    password:{type:String, required:true, length:{min:6}},
    classes: [{type:Schema.Types.ObjectId, ref:"Class"}],
    role: {type:String, default:"student"}
})

module.exports = mongoose.model("student", StudentSchema);