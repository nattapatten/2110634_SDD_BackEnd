const express = require('express');
const router = express.Router();
const { GetStudentDashboardData } = require('../controllers/studentDashboard');

// Route to get a student's courses by studentID
router.get('/:studentID/dashboard', GetStudentDashboardData);

module.exports = router;
