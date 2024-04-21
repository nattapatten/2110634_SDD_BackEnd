const StudentAssignment = require('../models/StudentAssignment');

exports.createStudentAssignment = async (req, res) => {
    try {
        const { student_ObjectID, studentID, course_ObjectID, courseID, assignmentCourse_ObjectID, score, dueDate } = req.body;

        const newAssignment = new StudentAssignment({
            student_ObjectID,
            studentID,
            course_ObjectID,
            courseID,
            assignmentCourse_ObjectID,
            score,
            dueDate,
            submittedDate: new Date()  // This is actually set by default, so it's not necessary unless you want to override it
        });

        await newAssignment.save();
        res.status(201).json({
            success: true,
            data: newAssignment
        });
    } catch (error) {
        console.error('Failed to create student assignment:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving student assignment'
        });
    }
};
