const express = require('express');
const { getAssignment,getAssignmentbyCourseID,getAssignmentbyUserID,createAssignment,updateAssignment, deleteAssignment, getAssignments} = require('../controllers/assignment');

const router = express.Router({mergeParams:true});
const {protect,protect2, authorize} = require('../middleware/auth');

router.route('/').post(protect2,authorize('teacher'),createAssignment);
router.route('/getByCourseID').get(getAssignmentbyCourseID);
router.route('/getByUserID').get(getAssignmentbyUserID);
router.route('/getByUserIDandCourseID').get(getAssignment);
router.route('/').put(protect2, updateAssignment);
router.delete('/',protect,deleteAssignment);
router.route('/').get(getAssignments);

// router.get('/me',protect2, getStudent);
// router.get('/', getStudent,getStudentbyID);
// router.post('/', createStudent);
// router.put('/',protect,updateStudent);
// router.delete('/',protect,deleteStudent);

module.exports=router;