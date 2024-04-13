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
//@route	GET /api/v1/assignments
//@access	Public
exports.getAssignmentbyUserID = async (req, res, next) => {
	try {
		const assignment = await Assignment.find({ studentID: req.body.studentID });
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

//@desc		Get single assignment
//@route	GET /api/v1/assignments
//@access	Public
exports.getAssignmentbyCourseID = async (req, res, next) => {
	try {
		const assignment = await Assignment.find({ courseID: req.body.courseID });
		if (!assignment) {
			return res.status(404).json({ success: false, message: `No assignment with the id of ${req.params.id}`});
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

//@desc		Get single assignment
//@route	GET /api/v1/assignments
//@access	Public
exports.getAssignment = async (req, res, next) => {
	try {
		const assignment = await Assignment.find({ studentID: req.body.studentID, courseID: req.body.courseID });
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
//@route	POST /api/v1/assignment
//@access	Private
exports.createAssignment = async (req, res, next) => {
	console.log("createAssignment")
	try {
		const assignment = await Assignment.create(req.body);
		res.status(201).json({ success: true, data: assignment });
	} catch (err) {
		res.status(400).json({ success: false });
		console.log(err.stack);
	}
};

//@desc		Update assignments
//@route	PUT /api/v1/assignments/
//@access	Private
exports.updateAssignment = async (req, res, next) => {
	console.log("updateAssignment")
	try {
		const assignment = await Assignment.findOneAndUpdate({ studentID: req.body.studentID, courseID: req.body.courseID, title: req.body.title }, req.body, {
			new: true,
			runValidators: true
		});
		if (!assignment) {
			return res.status(404).json({
				success: false,
				msg: 'assignment not found'
			});
		}
		res.status(200).json({
			success: true,
			data: assignment
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Cannot update Assignment"
		});
	}
};

// Delete user
// route DELETE /api/v1/assignment
// access Private/Admin
exports.deleteAssignment = async (req, res, next) => {
	console.log("delete Assignment")
	console.log({ studentID: req.body.studentID })
	try {
		const assignment = await Assignment.deleteMany({ studentID: req.body.studentID });

		if (!assignment) {
			return res.status(404).json({
				success: false,
				msg: 'assignment not found'
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