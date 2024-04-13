const mongoose = require('mongoose');
// >> questData
const AssignmentSchema=new mongoose.Schema({
    studentID: {
		type:String,
		required:true
    },
	courseID: {
		type:String,
		required:true
	},
	courseID: {
		type:String,
		required:true
	},
    title: {
		type:String,
		required:true
    },
    description: {
		type:String,
		required:true
    },
	time: {
		type: Date,
		default: Date.now,
	},
	dueDate: {
		type: Date,
		required:true
	}
});

module.exports=mongoose.model('Assignment', AssignmentSchema);
