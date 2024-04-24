const mongoose = require('mongoose');

// Define the schema for a course
const CourseSchema = new mongoose.Schema({
    course_ObjectID: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    courseID: {
        type: String,
        required: true
    },
    gradeLetter: {
        type: String,
        optional: true
    },
    gradePercentage: {
        type: Number,
        optional: true
    },
    enrollStatus: {
        type: String,
        optional: true,
        enum: ['0', '1', '2','3']
    }
}, { _id: false }); // Prevent Mongoose from creating a default _id for subdocuments

// Define the schema for the main document
const StudentSelectPathSchema = new mongoose.Schema({
    student_ObjectID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    studentID: {
        type: String,
        required: true
    },
    studentPath: {
        type: String,
        required: true
    },
    courses: [CourseSchema]
});

module.exports = mongoose.model('StudentSelectPath', StudentSelectPathSchema);
