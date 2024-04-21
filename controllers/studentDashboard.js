const StudentSelectPath = require("../models/StudentSelectPath");
const Course = require("../models/Course");
const AssignmentCourse = require("../models/AssignmentCourse");
const StudentAssignment = require("../models/StudentAssignment");

exports.GetStudentDashboardData = async (req, res) => {
    try {
      console.log("Accessing Dashboard Data for:", req.params.studentID);
      const student = await StudentSelectPath.findOne({
        studentID: req.params.studentID, // or use student_ObjectID if it's passed in the request
      }).lean();
  
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }
  
      // Get course and assignment details for each course in the student's path
      const courses = await Promise.all(
        student.courses.map(async (course) => {
          const courseDetails = await Course.findOne({
            courseID: course.courseID, // or use course_ObjectID if available in the course object
          }).lean();
          const assignments = await AssignmentCourse.find({
            courseID: course.courseID, // or use course_ObjectID
          }).lean();
  
          // Fetching student assignments for the course using object IDs
          const studentAssignments = await StudentAssignment.find({
            student_ObjectID: student.student_ObjectID,  // Assuming student._id matches student_ObjectID
            course_ObjectID: course.course_ObjectID,
            // Optionally include assignmentCourse_ObjectID if necessary and available
          }).lean();
  
          return { ...course, courseDetails, assignments, studentAssignments };
        })
      );
  
      res.json({ success: true, student, coursesAssignment: courses });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ success: false, message: "Server error", error });
    }
  };