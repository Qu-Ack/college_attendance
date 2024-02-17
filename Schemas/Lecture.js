const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const LectureSchema = new Schema({
    lectureName: String, 
    class: {type: Schema.Types.ObjectId, ref:"Class", required:true},
    dateTime: Date, 
    attendance: [{
        student:{type:Schema.Types.ObjectId, ref:"student"},
        status:{type:String, default:"A"},
    }],
    randvalues: [
        {type:String, unique:false}
    ]
})


module.exports = mongoose.model("Lecture", LectureSchema);




// how we will read the qr
// students will read the qr which will have lecture's _id and class _id emebedded in it.
// then after success we will send a post request to the backend with that embedded data along with student's object id who has scanned the qr.
// failure we will ask user to retry.
// after sending the data to the back end we will find the particular lecture the student has marked attendance for and will find the student who has marked the attendance.
// will add that to the lecture and mark the student present.
