const StudentSelectPath = require("../models/StudentSelectPath"); // adjust the path as necessary to where your model is stored
const Student = require("../models/Student"); // adjust the path as necessary to where your model is stored


// POST handler for creating a new StudentSelectPath entry
exports.createStudentSelectPath = async (req, res) => {
  if (!req.body.student_ObjectID || !req.body.studentID || !req.body.courses) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    // Create a new StudentSelectPath document from the data in the request body
    const newStudentSelectPath = new StudentSelectPath({
      student_ObjectID: req.body.student_ObjectID,
      studentID: req.body.studentID,
      courses: req.body.courses,
    });

    // Save the new document to the database
    const savedStudentSelectPath = await newStudentSelectPath.save();

    // Send a success response back to the client
    res.status(201).json({
      success: true,
      data: savedStudentSelectPath,
    });
  } catch (error) {
    // Handle potential errors
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.enrollStudentCourse = async (req, res) => {
  // Update enrollment status for a student's course
  // r const EnrollStatusEnum = {
  //     0: "Not Enroll",
  //     1: "Enroll",
  //     2: "Withdraw",
  //     3: "Pass",
  //   };
  console.log("req_from_front" , req.body);
  const { studentID, courseID ,enrollStatus} = req.body;


  console.log("studentID", studentID);
  console.log("courseID", courseID);
  console.log("enrollStatus", enrollStatus);

  if (!enrollStatus) {
    return res.status(400).send({ message: "Enroll status required" });
  }

  try {
    // Find the student and update the specific course's enroll status
    const updatedStudent = await Student.findOneAndUpdate(
      { studentID: studentID, "courses.courseID": courseID },
      { $set: { "courses.$.enrollStatus": enrollStatus } },
      { new: true } // Return the updated document
    );

    if (updatedStudent) {
      res.status(200).send(updatedStudent);
      console.log("Enroll Complete")
    } else {
      res.status(404).send({ message: "Student or course not found" });
    }
  } catch (error) {
    console.error("Error updating enroll status:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};
