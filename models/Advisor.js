const mongoose = require('mongoose');

const AdvisorSchema=new mongoose.Schema({
	advisorID: {
		type:String,
		required:true
	},
	name: {
		type:String,
		required:true
	},
    email: {
		type:String,
		required:true
    },
	students: [{
        type: String,
        required: false
    }],
    courses: [{
        type: String,
        required: false
    }]
});

module.exports=mongoose.model('Advisor', AdvisorSchema);
