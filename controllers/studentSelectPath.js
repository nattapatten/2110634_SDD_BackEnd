const StudentSelectPath = require('../models/StudentSelectPath'); // adjust the path as necessary to where your model is stored

// POST handler for creating a new StudentSelectPath entry
exports.createStudentSelectPath = async (req, res) => {
    if (!req.body.student_ObjectID || !req.body.studentID || !req.body.courses) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    try {
        // Create a new StudentSelectPath document from the data in the request body
        const newStudentSelectPath = new StudentSelectPath({
            student_ObjectID: req.body.student_ObjectID,
            studentID: req.body.studentID,
            courses: req.body.courses
        });

        // Save the new document to the database
        const savedStudentSelectPath = await newStudentSelectPath.save();

        // Send a success response back to the client
        res.status(201).json({
            success: true,
            data: savedStudentSelectPath
        });
    } catch (error) {
        // Handle potential errors
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
