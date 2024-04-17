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

//@desc		Get students detail by advisorID
//@route	GET /api/v1/student/
//@access	private
exports.getStudentsByAdvisorID = async (req, res, next) => {
    const advisorID = req.params.advisorID; // Assuming advisorID is passed as a URL parameter

    try {
        // Fetch the advisor to get the list of student IDs
        const advisor = await Advisor.findOne({ advisorID: advisorID });
        if (!advisor) {
            return res.status(404).json({ success: false, message: "Advisor not found" });
        }

        // Fetch the students using the list of student IDs
        const students = await Student.find({
            studentID: { $in: advisor.students } // Using $in to find all students whose IDs are listed in the advisor document
        });

        if (students.length === 0) {
            return res.status(404).json({ success: false, message: "No students found for this advisor" });
        }

        res.status(200).json({
            success: true,
            data: students
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error while retrieving students" });
    }
};



//@desc     Create new student
//@route    POST /api/v1/student
//@access   Private
exports.createStudent = async (req, res, next) => {
    console.log("createStudent")
    try{
        const {title,studentID, name, email, password,phone,role,advisorID,path,status,gpa } = req.body;
        const student = await Student.create({
            title,  
            studentID,
            name,
            email,
            password,
            phone,
            role,
            advisorID,
            path,
            status,
            gpa
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