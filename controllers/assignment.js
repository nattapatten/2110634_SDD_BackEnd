const { authorize } = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const User = require('../models/User')
//@desc		Get all assignment
//@route	GET /api/v1/assignment
//@access	Public
exports.getAssignments = async (req, res, next) => {
	let query;
	//General users can see only their assignment!
	// if(req.user.role !== 'admin'){
	// 	query=Assignment.find({user:req.user.id}).populate({
	// 		path:'assignment',
	// 		select: 'select something'
	// 	});
	// }else{ //If you are an admin, you can see all!
	if (req.params.courseId) {
		console.log(req.params.assignmentId);
		query = Assignment.find({ assignment: req.params.assignmentId }).populate({
			path: "course",
			select: "assignment assignmentTopic assignmentDetail dueDate",
		});
	} else {
		query = Assignment.find().populate({
			path: 'course',
			select: 'assignment assignmentTopic assignmentDetail dueDate'
		});
	}
	// }
	try {
		const assignment = await query;
		res.status(200).json({
			success: true,
			count: assignment.length,
			data: assignment
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ success: false, message: "Cannot find Assignment" });
	}
};

//At the end of file
//@desc     Get current Logged in user
//@route    POST /api/v1/auth/me
//@access   Private
exports.getAssignmentMe = async (req, res, next) => {
	const assignment = await Assignment.findById(req.user.id);
	res.status(200).json({
		success: true,
		data: assignment
	});
};

//At the end of file
//@desc     Get current Logged in user
//@route    POST /api/v1/auth/me
//@access   Private
exports.getMe = async (req, res, next) => {
	const user = await User.findById(req.user.id);
	res.status(200).json({
		success: true,
		data: user
	});
};

//@desc		Get single assignment
//@route	GET /api/v1/assignments/:id
//@access	Public
// exports.getAssignment=async (req,res,next)=>{
// 	try {
// 		const assignment = await Assignment.findById(req.params.id).populate({
// 			path:'course',
// 			select:'assignment assignmentTopic assignmentDetail dueDate'
// 		});

// 		if(!assignment){
// 			return res.status(404).json({success:false,message:`No assignment with the id of ${req.params.id}`});
// 		}

// 		res.status(200).json({
// 			seccess:true,
// 			data: assignment
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		return res.status(500).json({sucess:false,message:"Cannot find assignment"});
// 	}
// };


//@desc		Get single assignment
//@route	GET /api/v1/assignments/:id
//@access	Public
exports.getAssignment = async (req, res, next) => {
	try {
		// console.log(req.params)
		// const assignment = await Assignment.findById(req.params.id).populate({
		const assignment = await Assignment.find({ studentId: req.params.id });
		// console.log(assignment)
		// populate({
		// 	path:'course',
		// 	select:'assignment assignmentTopic assignmentDetail dueDate'
		// });

		if (!assignment) {

			return res.status(404).json({ success: false, message: `No assignment with the id of ${req.params.id}` });
		}

		res.status(200).json({
			seccess: true,
			data: assignment
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ sucess: false, message: "Cannot find assignment" });
	}
};

//@desc		create assignment
//@route	POST /api/v1/course/:courseId/assignment
//@access	Private
exports.createAssignment = async (req, res, next) => {
	try {
		req.body.course = req.params.courseId;
		const course = await Course.findById(req.params.courseId);

		if (!course) {
			return res.status(404).json({ sucess: false, message: `No course with the id of ${req.params.courseId}` });
		}

		//add user id to req.body
		req.body.user = req.user.id;
		// console.log(req.)
		//Check for existed appointment
		const existedAssignments=await Assignment.find({user:req.user.id,assignmentTopic:req.params.assignmentTopic});

		//If the user is not an admin, thep can only create 3 appointment.
		console.log(existedAssignments.length)
		// if(existedAssignments.length >= 1){
		// 	return res.status(400).json({
		// 		success:false,
		// 		message:`The user with ID ${req.user.id} has already have this assignment`
		// 	});
		// }

		// //If the user is not an admin, thep can only create 3 appointment.
		// if(existedAssignment.length >= 0 && req.user.role !== 'teacher'){
		// 	return res.status(400).json({
		// 		success:false,
		// 		message:`The user with ID ${req.user.id} can't add assignment`
		// 	});
		// }

		const assignment = await Assignment.create(req.body);
		res.status(200).json({
			success: true,
			data: assignment
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Cannot create assignment"
		});
	}

};

//@desc		Update assignments
//@route	PUT /api/v1/assignments/:courseID/:studentid
//@access	Private
exports.updateAssignment = async (req, res, next) => {
	try {
		// console.log(req.params.courseId);
		// console.log(req.params.studentId);
		let assignment = await Assignment.find({ courseId: req.params.courseId, studentId: req.params.studentId, assignmentTopic: req.body.assignmentTopic});
		console.log(assignment);
		console.log("1");
		if (!assignment) {
			return res.status(404).json({
				success: false,
				message: `No assignment with the id of ${req.params.id}`
			});
		}
		console.log("2");

		// Make sure user is the appointment owner
		// if(assignment.user.toString()!== req.user.id && req.user.role !== 'teacher'){
		// 	return res.status(401).json({
		// 		success:false,
		// 		message:`User ${req.params.id} is not authorized to update this assignment`
		// 	});
		// }
		console.log("3");
		// console.log(req.params.id); 
		console.log(req.body);

		let assignment2 = await Assignment.updateOne(
			{ courseId: req.params.courseId, studentId: req.params.studentId, assignmentTopic: req.body.assignmentTopic }, {
			$set: 
            {
                assignmentDetail: req.body.assignmentDetail,
                // new: true,
                // runValidators: true
            }
		});
		console.log(assignment2);
		console.log("4");
		// console.log(req.params.id); 
		// console.log(req.body.assignmentDetail);
		// appointment=await Assignment.findByIdAndUpdate({studentId:req.params.id},{studentId:req.body},{
		// 	$set: 
        //     {
        //         assignmentDetail: req.body.assignmentDetail,
        //         new: true,
        //         runValidators: true
        //     }
		// }); 

		assignment = await Assignment.find({ courseId: req.params.courseId, studentId: req.params.studentId, assignmentTopic: req.body.assignmentTopic});		console.log(assignment);
		res.status(200).json({
			success: true,
			data: assignment
		});
	} catch (error) {
		// console.log(error);
		// return res.status(500).json({
		// 	success:false,
		// 	message:"Cannot update Assignment"
		// });
	}
};