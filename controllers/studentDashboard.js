// const StudentSelectPath = require("../models/StudentSelectPath");
// const Course = require("../models/Course");
// const AssignmentCourse = require("../models/AssignmentCourse");
// const StudentAssignment = require("../models/StudentAssignment");

// exports.GetStudentDashboardData = async (req, res) => {
//     try {
//       console.log("Accessing Dashboard Data for:", req.params.studentID);
//       const student = await StudentSelectPath.findOne({
//         studentID: req.params.studentID // Assuming `studentID` is used as a unique identifier
//       }).lean();

//       if (!student) {
//         return res.status(404).json({
//           success: false,
//           message: "Student not found",
//         });
//       }

//       // Get course and assignment details for each course in the student's path
//       const coursesAssignments = await Promise.all(
//         student.courses.map(async (course) => {
//           // Fetch course details
//           const courseDetails = await Course.findOne({
//             _id: course.course_ObjectID // Adjusted to use _id which is typical for MongoDB references
//           }).lean();

//           // Fetch assignments for the course
//           const assignments = await AssignmentCourse.find({
//             course_ObjectID: course.course_ObjectID
//           }).lean();

//           // Fetch student assignments for the specific course
//           const studentAssignments = await StudentAssignment.find({
//             student_ObjectID: student._id,  // Use `_id` from the `student` document
//             course_ObjectID: course.course_ObjectID
//           }).lean();

//           // Combine all fetched details into a single object per course
//           return { ...course, courseDetails, assignments, studentAssignments };
//         })
//       );

//       // Return the aggregated student and courses data
//       res.json({ success: true, student, coursesAssignments });
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//       res.status(500).json({ success: false, message: "Server error", error });
//     }
//   };



// const StudentSelectPath = require("../models/StudentSelectPath");
// const Course = require("../models/Course");
// const AssignmentCourse = require("../models/AssignmentCourse");
// const StudentAssignment = require("../models/StudentAssignment");

// exports.GetStudentDashboardData = async (req, res) => {
//   try {
//     console.log("Accessing Dashboard Data for:", req.params.studentID);
//     const student = await StudentSelectPath.findOne({
//       studentID: req.params.studentID, // or use student_ObjectID if it's passed in the request
//     }).lean();

//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found",
//       });
//     }

//     // Get course and assignment details for each course in the student's path
//     const courses = await Promise.all(
//       student.courses.map(async (course) => {
//         const courseDetails = await Course.findOne({
//           courseID: course.courseID, // or use course_ObjectID if available in the course object
//         }).lean();
//         const assignments = await AssignmentCourse.find({
//           courseID: course.courseID, // or use course_ObjectID
//         }).lean();

//         // Fetching student assignments for the course using object IDs
//         const studentAssignments = await StudentAssignment.find({
//           student_ObjectID: student.student_ObjectID,  // Assuming student._id matches student_ObjectID
//           course_ObjectID: course.course_ObjectID,
//           // Optionally include assignmentCourse_ObjectID if necessary and available
//         }).lean();

//         return { ...course, courseDetails, assignments, studentAssignments };
//       })
//     );

//     res.json({ success: true, student, coursesAssignment: courses });
//   } catch (error) {
//     console.error("Error fetching dashboard data:", error);
//     res.status(500).json({ success: false, message: "Server error", error });
//   }
// };



// exports.getStudentDashboardCourse = async (req, res) => {
//   try {
//     // const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
//     // const db = client.db(dbName);

//     const studentId = req.params.studentId; // Retrieve the studentId from the request parameters

//     const results = await db.collection('registrations').aggregate([
//       { $match: { studentID: studentId } }, // Match the studentID with the one provided in the URL
//       { $unwind: "$courses" },
//       {
//         $lookup: {
//           from: 'courses',
//           localField: 'courses.courseID',
//           foreignField: 'courseID',
//           as: 'courseDetails'
//         }
//       },
//       {
//         $unwind: "$courseDetails"
//       },
//       {
//         $group: {
//           _id: '$_id',
//           studentID: { $first: '$studentID' },
//           courses: {
//             $push: {
//               course_ObjectID: '$courses.course_ObjectID',
//               courseID: '$courses.courseID',
//               gradeLetter: '$courses.gradeLetter',
//               gradePercentage: '$courses.gradePercentage',
//               enrollStatus: '$courses.enrollStatus',
//               courseName: '$courseDetails.courseName',
//               maxStudents: '$courseDetails.maxStudents',
//               currentStudents: '$courseDetails.currentStudents'
//             }
//           }
//         }
//       }
//     ]).toArray();

//     client.close();
//     res.json(results);
//   } catch (err) {
//     console.error("Failed to retrieve data: ", err);
//     res.status(500).send("Failed to retrieve data");
//   }
// };



const StudentSelectPath = require("../models/StudentSelectPath");
const Course = require("../models/Course");
const AssignmentCourse = require("../models/AssignmentCourse");
const StudentAssignment = require("../models/StudentAssignment");
const Student = require("../models/Student"); // This is your Student model that contains the GPA field.

exports.GetStudentDashboardData = async (req, res) => {
  try {
    console.log("Accessing Dashboard Data for:", req.params.studentID);
    const studentPath = await StudentSelectPath.findOne({
      studentID: req.params.studentID,
    }).lean();

    if (!studentPath) {
      return res.status(404).json({
        success: false,
        message: "Student path not found",
      });
    }

    // Fetch GPA from the Student model
    const studentDetails = await Student.findOne({
      studentID: req.params.studentID
    }).lean();

    if (!studentDetails) {
      return res.status(404).json({
        success: false,
        message: "Student details not found"
      });
    }

    // Combine student path and student details
    const student = {
      ...studentPath,
      gpa: Number(studentDetails.gpa) // Adding GPA here
    };

    // Get course and assignment details for each course in the student's path
    const courses = await Promise.all(
      studentPath.courses.map(async (course) => {
        const courseDetails = await Course.findOne({
          courseID: course.courseID,
        }).lean();
        const assignments = await AssignmentCourse.find({
          courseID: course.courseID,
        }).lean();

        // Fetching student assignments for the course using object IDs
        const studentAssignments = await StudentAssignment.find({
          student_ObjectID: studentPath.student_ObjectID,
          course_ObjectID: course.course_ObjectID,
        }).lean();

        return { ...course, courseDetails, assignments, studentAssignments };
      })
    );

    res.json({
      success: true,
      student: student, // student details now include GPA
      coursesAssignment: courses
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
