const AssignmentCourse = require('../models/AssignmentCourse'); // Make sure the path is correct

exports.createAssignment = async (req, res, next) => {
    try {
        // Extract the assignment details from the request body
        const { courseID, title, description, dueDate, time } = req.body;

        // Create a new assignment using the AssignmentCourse model
        const newAssignment = new AssignmentCourse({
            courseID,
            title,
            description,
            dueDate: new Date(dueDate),
            time: new Date(time)
        });

        // Save the new assignment to the database
        const assignment = await newAssignment.save();

        // Send a success response back to the client
        res.status(201).json({
            success: true,
            data: assignment
        });
    } catch (error) {
        // Handle errors and send an error response
        next(error);
    }
};


//find all assignmentCourse
exports.getAssignmentCourses = async (req, res, next) => {
    const AssignmentCourses = await AssignmentCourse.find();
    res.status(200).json(
        {
            success: true,
            data: AssignmentCourses
        }
    )
};

exports.updateAssignmentCourse = async (req, res, next) => {
    try {
        const user = await AssignmentCourse.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'AssignmentCourse not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: err.message
        });
    }
};

exports.deleteAssignmentCourse = async (req, res, next) => {
    try {
        const advisor = await AssignmentCourse.findByIdAndDelete(req.params.id);

        if (!advisor) {
            return res.status(404).json({
                success: false,
                msg: 'AssignmentCourse not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: err.message
        });
    }
};

const Advisor = require('../models/Advisor'); // Import Advisor model
// const AssignmentCourse = require('../models/AssignmentCourse'); // Import AssignmentCourse model

// exports.getAssignmentsByAdvisorID = async (req, res, next) => {
    
//     try {
//         // Extract advisorID from the request parameters
//         const advisorID = req.params.id;
//         // console.log(req.params.id)
//         // console.log(advisorID)

//         // Find the advisor by advisorID
//         const advisor = await Advisor.findOne({ advisorID: advisorID });
//         if (!advisor) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Advisor not found'
//             });
//         }

//         // Extract the list of courseIDs from the advisor document
//         const { courses } = advisor;

//         // Find all AssignmentCourses that match the courseIDs from the advisor's courses list
//         const assignments = await AssignmentCourse.find({ courseID: { $in: courses } });

//         // Return the found assignments
//         res.status(200).json({
//             success: true,
//             data: assignments
//         });
//     } catch (error) {
//         // Pass any errors to the next middleware
//         next(error);
//     }
// };

exports.getAssignmentsByAdvisorID = async (req, res, next) => {
    try {
        // Extract advisorID from the request parameters
        const advisorID = req.params.id;  // Ensure parameter name matches your route setup

        // Find the advisor by advisorID
        const advisor = await Advisor.findOne({ advisorID: advisorID });
        if (!advisor) {
            return res.status(404).json({
                success: false,
                message: 'Advisor not found'
            });
        }

        // Extract the list of courseIDs from the advisor document
        const { courses } = advisor;

        // Find all AssignmentCourses that match the courseIDs from the advisor's courses list
        const assignments = await AssignmentCourse.find({ courseID: { $in: courses } });

        // Check if assignments are found
        if (!assignments || assignments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No assignments found for the given advisor'
            });
        }

        // Return the found assignments
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
