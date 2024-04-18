const Course = require("../models/Course");
const Advisor = require("../models/Advisor");
const Student = require("../models/Student");

exports.register = async (req, res, next) => {
  try {
    const { courseID, courseName, maxStudents, currentStudents } = req.body;

    const course = await Course.create({
      courseID,
      courseName,
      maxStudents,
      currentStudents,
    });
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};

//@desc Get all courses
//@route Get /api/v1/courses
//@access Public

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();
    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Get single course
//@route Get /api/v1/courses/:id
//@access Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(400).json({ success: false });

    res.status(200).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Create a course
//@route POST /api/v1/courses
//@access Private
exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Update single course
//@route PUT /api/v1/courses/:id
//@access Private
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) return res.status(400).json({ success: false });

    res.status(200).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Delete single course
//@route DELETE /api/v1/courses/:id
//@access Private

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(400).json({ success: false });

    res.status(200).json({ success: true, data: [] });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// Get courses by advisorID
// Route: GET /api/v1/courses/advisor/:advisorID
// Access: Public
exports.getCoursesByAdvisor = async (req, res, next) => {
  try {
      const advisorID = req.params.advisorID;
      
      // Find the advisor to get their courses list
      const advisor = await Advisor.findOne({ advisorID: advisorID });
      if (!advisor) {
          return res.status(404).json({
              success: false,
              message: "Advisor not found"
          });
      }

      // Extract course IDs from the advisor's courses array
      const courseIDs = advisor.courses;
      if (!courseIDs || courseIDs.length === 0) {
          return res.status(404).json({
              success: false,
              message: "No courses found for the given advisor"
          });
      }

      // Find all courses that match the courseIDs from the advisor's courses list
      const courses = await Course.find({ courseID: { $in: courseIDs } });

      if (!courses || courses.length === 0) {
          return res.status(404).json({
              success: false,
              message: "No courses found for the given advisor"
          });
      }

      // Mapping the course data to only return required fields
      const courseData = courses.map(course => ({
          courseID: course.courseID,
          courseName: course.courseName,
          maxStudents: course.maxStudents,
          currentStudents: course.currentStudents
      }));

      // Return the filtered list of courses
      res.status(200).json({
          success: true,
          count: courses.length,
          data: courseData
      });

  } catch (err) {
      console.error("Error fetching courses by advisor ID:", err);
      res.status(500).json({
          success: false,
          message: "Server error"
      });
  }
};

// Get courses by studentID
// Route: GET /api/v1/courses/student/:studentID
// // Access: Public
// exports.getCoursesByStudentID = async (req, res, next) => {
//   try {
//       const { studentID } = req.params;

//       // Find the student by studentID
//       const student = await Student.findOne({ studentID: studentID });
//       if (!student) {
//           return res.status(404).json({
//               success: false,
//               message: "Student not found"
//           });
//       }

//       // Extract the list of currentCourses from the student document
//       const { currentCourses } = student;

//       // Check if currentCourses array exists and is not empty
//       if (!currentCourses || currentCourses.length === 0) {
//           return res.status(404).json({
//               success: false,
//               message: "No current courses found for this student"
//           });
//       }

//       // Find all courses that match the courseIDs in the student's currentCourses list
//       const courses = await Course.find({ courseID: { $in: currentCourses } });

//       if (!courses || courses.length === 0) {
//           return res.status(404).json({
//               success: false,
//               message: "No course details found for the given courses"
//           });
//       }

//       // Return the list of courses
//       res.status(200).json({
//           success: true,
//           data: courses
//       });
//   } catch (err) {
//       console.error("Error fetching courses by student ID:", err);
//       res.status(500).json({
//           success: false,
//           message: "Server error"
//       });
//   }
// };



// exports.getCoursesByStudentID = async (req, res, next) => {
//   try {
//       const { studentID } = req.params;
      
//       // Find the student by studentID
//       const student = await Student.findOne({ studentID });
//       if (!student) {
//           return res.status(404).json({
//               success: false,
//               message: "Student not found"
//           });
//       }

//       // If no courses are associated with the student, return an empty list
//       if (!student.courses || student.courses.length === 0) {
//           return res.status(200).json({
//               success: true,
//               data: []
//           });
//       }

//       // Extract courseIDs from student courses
//       const courseIDs = student.courses.map(course => course.courseID);

//       // Fetch course details from the Course model
//       const coursesInfo = await Course.find({ courseID: { $in: courseIDs } });

//       // Map the detailed information to include course status and GPA
//       const courseData = student.courses.map(course => {
//           const courseDetails = coursesInfo.find(info => info.courseID === course.courseID) || {};
//           return {
//               courseNumber: course.courseID,
//               courseName: courseDetails.courseName || "Unknown Course", // Default if no course name is found
//               status: course.courseStatus,
//               // image: "path_to_books_image", // Assuming a static image or dynamically setting this based on course details
//               gpa: course.GPA
//           };
//       });

//       // Return the list of detailed course information
//       res.status(200).json({
//           success: true,
//           data: courseData
//       });
//   } catch (error) {
//       console.error("Error fetching courses by student ID:", error);
//       res.status(500).json({
//           success: false,
//           message: "Server error",
//           error: error.message
//       });
//   }
// };



exports.getCoursesByStudentID = async (req, res, next) => {
  try {
      const { studentID } = req.params;
      
      // Find the student by studentID
      const student = await Student.findOne({ studentID });
      if (!student) {
          return res.status(404).json({
              success: false,
              message: "Student not found"
          });
      }

      // If no courses are associated with the student, return an empty list
      if (!student.courses || student.courses.length === 0) {
          return res.status(200).json({
              success: true,
              data: []
          });
      }

      // Extract courseIDs from student courses
      const courseIDs = student.courses.map(course => course.courseID);

      // Fetch course details from the Course model
      const coursesInfo = await Course.find({ courseID: { $in: courseIDs } });

      // Map the detailed information to include course status and GPA
      const courseData = student.courses.map(course => {
          const courseDetails = coursesInfo.find(info => info.courseID === course.courseID) || {};
          console.log('GPA here');
          console.log(course)
          console.log(course.courseID)
          console.log(course.courseStatus)
          console.log(course.courseGpa)
          return {
              courseNumber: course.courseID,
              courseName: courseDetails.courseName || "Unknown Course", // Default if no course name is found
              status: course.courseStatus,
              image: "path_to_books_image", // Assuming a static image or dynamically setting this based on course details
              courseGpa: (course.courseStatus === 100 ? course.courseGpa : null) // Set GPA only if courseStatus is 100
          };
      });

      // Return the list of detailed course information
      res.status(200).json({
          success: true,
          data: courseData
      });
  } catch (error) {
      console.error("Error fetching courses by student ID:", error);
      res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message
      });
  }
};