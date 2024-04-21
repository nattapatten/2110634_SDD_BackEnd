const mongoose = require('mongoose');

const StudentAssignmentSchema = new mongoose.Schema({
    student_ObjectID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    studentID: {
        type: String,
        required: true
    },
    course_ObjectID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    courseID: {
        type: String,
        required: true
    },
    assignmentCourse_ObjectID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }

});

module.exports = mongoose.model('StudentAssignment', StudentAssignmentSchema);