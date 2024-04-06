const mongoose = require('mongoose');
const Assignment = require('./Assignment');

const CourseSchema = new mongoose.Schema({
    couresName:{
        type:String,
        required : [true,'Please add a course name.'],
        unique : true,
        trim : true,
        maxlength : [50 , 'Name can not be more than 50 characters']
    },
    courseId:{
        type:String,
        required : [true,'Please add a course Id'],
        maxlength : [7, 'Postal Code can not be more than 6 digits']

    },
    teacherName:{
        type:String,
        required : [true,'Please add a course name.'],
        unique : true,
        trim : true,
        maxlength : [50 , 'Name can not be more than 50 characters']
    },
    tel:{
        type:String
    }
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

//Cascade delete appointment when a course is deleted
CourseSchema.pre('deleteOne',{document: true, query: false},async function(next){
    console.log(`Assignment being removed from course ${this._id}`);
    await this.model('Assignment').deleteMany({course:this._id});
    next();
})

//Reverse populate with virtuals
CourseSchema.virtual('assignment',{
    ref: 'Assignment',
    localField: '_id',
    foreignField:'course',
    justOne:false
});

module.exports=mongoose.model('Course',CourseSchema);