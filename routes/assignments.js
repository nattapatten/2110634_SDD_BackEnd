const express = require('express');
const { getAssignments,getAssignment,createAssignment,updateAssignment,getStudentAssignment} = require('../controllers/assignment');



const router = express.Router({mergeParams:true});
const {protect, authorize} = require('../middleware/auth');



router.route('/').get(getAssignments).post(protect,authorize('teacher'),createAssignment);
router.route('/:id').get(getAssignment);
router.route('/:courseId/:studentId').put(protect, authorize('teacher'), updateAssignment);

module.exports=router;