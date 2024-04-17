const express = require('express');
const {getCourses,getCoursebyCourseID,updateCourse,deleteCourse,createCourse,getCoursesByAdvisorID} = require('../controllers/course');
const router = express.Router();
const {protect,protect2, authorize} = require('../middleware/auth');

// router.route('/').get(getCourses).post(protect2,authorize('teacher'),createCourse);
router.route('/').get(getCourses).post(createCourse);
router.route('/getByCourseID').get(getCoursebyCourseID);
router.route('/').put(protect2, updateCourse);
router.delete('/',protect,deleteCourse);
router.get('/getCoursesByAdvisorID/:id', getCoursesByAdvisorID);
module.exports=router;