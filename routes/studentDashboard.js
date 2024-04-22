const express = require('express');
const router = express.Router();
const { GetStudentDashboardData  , getStudentDashboardCourse} = require('../controllers/studentDashboard');

// Route to get a student's courses by studentID
router.get('/:studentID/dashboard', GetStudentDashboardData);

// router.get('/:studentID/dashboard', getStudentDashboardCourse);

module.exports = router;
