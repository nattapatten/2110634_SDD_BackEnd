const express = require('express');
const router = express.Router();
const { createStudentSelectPath  , enrollStudentCourse} = require('../controllers/studentSelectPath');  // Correct the name to match the exported function

// Route that handles creation of a new StudentSelectPath
router.post('/createStudentSelectPath', createStudentSelectPath);  // Use correct case and function name
router.post('/enrollStudentCourse', enrollStudentCourse);  // Use correct case and function name

module.exports = router;
