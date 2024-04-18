const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    studentID: {
        type: String,
        required: [true, 'Please add a student ID']
    },
    pathName: {
        type: String,
        required: [true, 'Please add a path name'],
    },
    status: {
        type: String,
        required: [true, 'Please add a status'],
    },
    gpa: {
        type: String,
        required: [true, 'Please add a gpa'],
    },
    courses: [{
        courseID: { type: String, required: false },
        courseStatus: { type: Number, required: false, min: 0, max: 100 },
        courseGpa: { type: String, enum: ['A', 'B', 'C', 'D', 'F', null], required: false }
    }],
    registDate: {
        type: Date,
        default: Date.now,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Student', StudentSchema);
