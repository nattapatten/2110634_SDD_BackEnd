const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: [true, "please add a course name"],
  },
  courseDetails: {
    type: String,
    required: [true, "Please add a course details"],
  },
  semester: {
    type: String,
    required: false,
  },
  year: {
    type: String,
    required: false,
  },
  advisorID: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Course", CourseSchema);
