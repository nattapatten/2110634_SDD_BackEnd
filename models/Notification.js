const mongoose = require('mongoose');
// >> questData
const NotificationSchema=new mongoose.Schema({
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
    dueDate: {
		type: Date,
        required:false
		// default: Date.now,
	},
    createBy: {
		type:String,
		required:false
    },
	createdAt: {
		type: Date,
		default: Date.now,
	},
    updateBy: {
		type:String,
		required:false
    },
	updatedAt: {
        type: Date,
		default: Date.now,
	}
});

module.exports=mongoose.model('Notification', NotificationSchema);
