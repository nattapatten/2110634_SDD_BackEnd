const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    courseID:{
        type:String,
        required : [true,'Please add a course Id'],
        maxlength : [7, 'course Code can not be more than 7 digits']
    },
    courseName:{
        type:String,
        required : [true,'Please add a course name.'],
        trim : true,
        maxlength : [50 , 'Name can not be more than 50 characters']
    },
    maxStudents:{
        type:String,
        required : [true,'Please add a maxStudents.'],
    },
    currentStudents:{
        type:String,
        required : [true,'Please add a currentStudents.'],
    }
});

module.exports=mongoose.model('Course',CourseSchema);