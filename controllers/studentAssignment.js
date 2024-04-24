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



exports.getAssignmentsByCourseID = async (req, res, next) => {
    try {

        if (!req) {
            return res.status(404).json({
                success: false,
                message: 'Course Assignment not found'
            });
        }



        const courseIds = req.body;
        const assignments = await AssignmentCourse.find({
            courseID: { $in: courseIds }
        }).sort({ dueDate: 1 });;

        // const assignments = await AssignmentCourse.find({ courseID: { $in: courses } }).sort({ dueDate: 1 });

        // Check if assignments are found
        if (!assignments || assignments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No assignments found for the given advisor'
            });
        }

        // Return the found assignments sorted by dueDate
        res.status(200).json({
            success: true,
            data: assignments
        });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching assignments by advisor ID:', error);

        // Pass any errors to the next middleware
        next(error);
    }
};
