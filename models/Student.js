const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const StudentSchema=new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a status']
    },
    // image: {
    //     type: ImageBitmap
    // },
    studentID: {
        type: String,
        required: [true, 'Please add a student ID']
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
      },
    // password: {
    //     type: String,
    //     required: [true, 'Please add a password'],
    //     minLength: 6,
    //     select: false
    // },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    role: {
        type: String,
        enum : ['user','admin','publisher','student','teacher','commitee'],
        default : 'student'
    },
    advisorID: {
        type: String,
        required: [true, 'Please add an advisorID'],
    },
	path: {
		type:String,
		required:true
	},
    status:{
        type: String,
        required: [true, 'Please add a status'],
    },
    gpa:{
        type: String,
        required: [true, 'Please add a gpa'],
    },
    registDate: {
		type: Date,
		default: Date.now,
	},
    lastUpdated:{
        type: Date,
		default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

//Encrypt password using bcrypt
StudentSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});


//Sign JWT and return
StudentSchema.methods.getSignedJwtToken = function(){
    return jwt.sign(
        {id:this._id},
        process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
}

//Match user enterd password to hashed password in database
StudentSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword , this.password);
}

module.exports=mongoose.model('Student', StudentSchema);
