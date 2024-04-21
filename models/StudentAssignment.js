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
    },
    score: {
        type: Number, // Corrected type for score
        default: 0
    },
    dueDate: {
        type: Date,
        default: null
    },
    submittedDate: {
        type: Date,
        default: null
        // default: () => Date.now() // Use a function to ensure the current date/time
    }
});

module.exports = mongoose.model('StudentAssignment', StudentAssignmentSchema);
