const express = require('express');
const {getCourse,getCourses,updateCourse,deleteCourse,createCourse} = require('../controllers/course');

//Include other resource routers
const assignmentRouter = require('./assignments');

const router = express.Router();
const {protect, authorize} = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:courseId/assignments',assignmentRouter);

router.route('/').get(getCourses).post(protect, authorize('teacher'), createCourse);
router.route('/:id').get(getCourse).put(protect, authorize('teacher'), updateCourse).delete(protect, authorize('teacher'), deleteCourse);

module.exports=router;