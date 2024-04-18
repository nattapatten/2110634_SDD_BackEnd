const mongoose = require('mongoose');

const AssignmentCourseSchema = new mongoose.Schema({
    courseID: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('AssignmentCourse', AssignmentCourseSchema);
