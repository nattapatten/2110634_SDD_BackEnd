const StudentSelectPath = require("../models/StudentSelectPath");
const Course = require("../models/Course");
const AssignmentCourse = require("../models/AssignmentCourse");

exports.GetStudentDashboardData = async (req, res) => {
  try {
    console.log("Accessing Dashboard Data for:", req.params.studentID);
    const student = await StudentSelectPath.findOne({
      studentID: req.params.studentID,
    }).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Get course details for each course in the student's path
    const courses = await Promise.all(
      student.courses.map(async (course) => {
        const courseDetails = await Course.findOne({
          courseID: course.courseID,
        }).lean();
        const assignments = await AssignmentCourse.find({
          courseID: course.courseID,
        }).lean();
        return { ...course, courseDetails, assignments };
      })
    );

    res.json({ success: true, student, coursesAssignment : courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
