const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseID: {
    type: String,
    required: [true, "please add a course ID"],
  },
  courseName: {
    type: String,
    required: [true, "please add a course name"],
  },
  maxStudents: {
    type: String,
    required: [true, "Please add a maxStudents"],
  },
  currentStudents: {
    type: String,
    required: [true, "Please add a currentStudents"],
  },
});

module.exports = mongoose.model("Course", CourseSchema);
