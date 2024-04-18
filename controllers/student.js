const { authorize } = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const User = require('../models/User')
const Student = require('../models/Student')
const Advisor = require('../models/Advisor')


//@desc		Get current student
//@route	GET /api/v1/student/me
//@access	private
exports.getStudent = async (req, res, next) => {
    // console.log("getStudent")
	// console.log(req.user)
	let query = await Student.findById(req.user.id);
	// console.log("query Student")
	try {
		const student = await query;
		res.status(200).json({
			success: true,
			data: student
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ success: false, message: "Cannot find student" });
	}
};

//@desc		Get student detail by 
//@route	GET /api/v1/student/
//@access	private
exports.getStudentbyID = async (req, res, next) => {
    // console.log("getStudentbyID")
	// console.log({studentID:req.body.studentID})
	let query = await Student.find({studentID:req.body.studentID});
	// console.log("query StudentbyID")
	try {
		const student = await query;
		res.status(200).json({
			success: true,
			data: student
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ success: false, message: "Cannot find student" });
	}
};


exports.getStudentsByAdvisorID = async (req, res, next) => {
    try {
        const advisorID = req.params.advisorID;

        // Find the advisor by ID
        const advisor = await Advisor.findOne({ advisorID: advisorID });
        if (!advisor) {
            return res.status(404).json({ success: false, message: "Advisor not found" });
        }

        // Check if advisor has associated students
        if (!advisor.students || advisor.students.length === 0) {
            return res.status(404).json({ success: false, message: "No students found for this advisor" });
        }

        // Get student IDs from the advisor document
        const studentIDs = advisor.students;

        // Perform an aggregation to join Student data with User data and include course details
        const students = await Student.aggregate([
            { $match: { studentID: { $in: studentIDs } } }, // Match student records
            {
                $lookup: {
                    from: "users", // This should match the MongoDB collection name for users
                    localField: "studentID", // Field from Student model
                    foreignField: "studentID", // Field from User model
                    as: "userData" // Array containing joined User documents
                }
            },
            { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } }, // Unwind the array, handling missing userData gracefully
            { $addFields: {
                name: "$userData.name",
                email: "$userData.email",
                phone: "$userData.phone"
            }},
            { $project: {
                _id: 1, // Include MongoDB's default _id field
                studentID: 1,
                name: 1,
                email: 1,
                phone: 1,
                pathName: 1,
                status: 1,
                title: 1,
                gpa: 1,
                courses: 1, // Include the whole courses array with all details
                registDate: 1,
                lastUpdated: 1
            }} // Select all required fields
        ]);

        // Return the list of students with detailed information including course data
        res.status(200).json({
            success: true,
            data: students
        });
    } catch (error) {
        console.error("Failed to retrieve students by advisor ID:", error);
        next(error); // Pass the error to the next middleware
    }
};



exports.createStudent = async (req, res, next) => {
    try {
        // Destructure the body to get all relevant fields, including nested course data
        const { title, studentID, pathName, status, gpa, courses } = req.body;

        // Determine title based on status directly in the controller if needed
        const computedTitle = status === '100' ? 'Graduated' : 'In Progress';

        // Create the student in the database
        const student = await Student.create({
            title: computedTitle,  // Use computed title based on status or use the one provided by the request
            studentID,
            pathName,
            status,
            gpa,  // Consider computing or validating the GPA based on courses if necessary
            courses,  // Ensure courses are included as part of the request
            registDate: new Date(),  // You can set the registration date explicitly if you want to override the default
            lastUpdated: new Date()  // Same for the last updated date
        });

        // Respond with success and the created student data
        res.status(201).json({
            success: true,
            data: student
        });
    } catch (err) {
        console.error(err);  // Log the error to the console for debugging
        res.status(400).json({
            success: false,
            message: 'Failed to create student',
            error: err.message
        });
    }
};

//get all students
exports.getStudents = async (req, res, next) => {
    const student = await Student.find();
    res.status(200).json(
        {
            success: true,
            data: student
        }
    )
};
//Get token from model, create cookie and send response
// const sendTokenResponse = (user, statusCode, res) => {
//     //Create token
	
//     const token = user.getSignedJwtToken();

//     const options = {
//         expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
//         httpOnly: true
//     };

//     if(process.env.NODE_ENV === 'production'){
//         options.secure = true;
//     } 

//     res.status(statusCode).cookie('token', token, options).json({
//         success: true,
//         token
//     })
// }


//@desc		Update student
//@route	PUT /api/v1/student/:studentID
//@access	Private
exports.updateStudent = async (req, res, next) => {
	try {
        const student = await Student.findOneAndUpdate({studentID:req.body.studentID}, req.body, {
            new: true,
            runValidators: true
        });
        if (!student) {
            return res.status(404).json({
                success: false,
                msg: 'Student not found'
            });
        }
        res.status(200).json({
            success: true,
            data: student
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: err.message
        });
    }
};

// Delete user
// route DELETE /api/v1/users/:id
// access Private/Admin
exports.deleteStudent = async (req, res, next) => {

    try {
        const student = await Student.findOneAndDelete({studentID:req.body.studentID});
        
        if (!student) {
            return res.status(404).json({
                success: false,
                msg: 'student not found'
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

// get student by advisorID
// title: "Graduated",
    //         image: StudentProfile,
    //         path: "Software Engineer",
    //         name: "James James",
    //         studentID: "11111111",
    //         status: "100",
    //         gpa: "3.80",
    //         lastUpdated: "2023-12-15T08:30:00",