const mongoose = require('mongoose');

const AssignmentSchema=new mongoose.Schema({
    dueDate: {
		type: Date,
		required:true
	},
    studentId: {
		type:mongoose.Schema.ObjectId,
		ref: 'User',
		required:true
    },
    assignmentTopic: {
		type:String,
		required:true
    },
    assignmentDetail: {
		type:String,
		required:true
    },
	course: {
		type:mongoose.Schema.ObjectId,
		ref: 'Course',
		required:true
	},
	createDate: {
		type: Date,
		default: Date.now,
	},
});

module.exports=mongoose.model('Assignment', AssignmentSchema);
