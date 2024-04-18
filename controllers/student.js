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
    console.log("getStudent")
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
    console.log("getStudentbyID")
	console.log({studentID:req.body.studentID})
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
        const advisorID = req.params.advisorID; // Get advisorID from URL parameters

        // Find the advisor by ID
        const advisor = await Advisor.findOne({ advisorID: advisorID });
        if (!advisor) {
            return res.status(404).json({ message: "Advisor not found" });
        }

        // Get student IDs from the advisor document
        const studentIDs = advisor.students;

        // Perform an aggregation to join Student data with User data
        const students = await Student.aggregate([
            { $match: { studentID: { $in: studentIDs } } }, // Match student records from the advisor's list
            {
                $lookup: {
                    from: "users", // This should match the MongoDB collection name for users
                    localField: "studentID", // Field from Student model
                    foreignField: "studentID", // Field from User model
                    as: "userData" // Array containing joined User documents
                }
            },
            { $unwind: "$userData" }, // Unwind the array to make processing easier
            { $project: {
                studentID: 1,
                name: "$userData.name",
                email: "$userData.email",
                phone: "$userData.phone",
                path: "$pathName",
                status: 1,
                title: 1,
                gpa: 1
            }} // Select only required fields and rename pathName to path
        ]);

        // Return the list of students with detailed information
        res.status(200).json(students);
    } catch (error) {
        next(error); // Handle errors and pass to error-handling middleware
    }
};



//@desc     Create new student
//@route    POST /api/v1/student
//@access   Private
exports.createStudent = async (req, res, next) => {
    console.log("createStudent")
    try{
        const {title,studentID, pathName,status,gpa } = req.body;
        const student = await Student.create({
            title,studentID, pathName,status,gpa
        });
        //Create token
        // const token = student.getSignedJwtToken();
        // res.status(200).json({success: true, token});
        res.status(200).json(
            {
                success: true,
                data: student
            }
        )

    } catch(err){
        res.status(400).json({success: false});
        console.log(err.stack);
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