const express = require('express');
const { getAssignments,getAssignment,createAssignment,updateAssignment,getStudentAssignment} = require('../controllers/assignment');



const router = express.Router({mergeParams:true});
const {protect,protect2, authorize} = require('../middleware/auth');



router.route('/').get(getAssignments).post(protect2,authorize('teacher'),createAssignment);
router.route('/getMyAssign').get(getAssignment);
router.route('/:courseId/:studentID').put(protect2, authorize('teacher'), updateAssignment);

module.exports=router;