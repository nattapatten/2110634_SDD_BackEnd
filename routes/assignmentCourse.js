const express = require('express');
const { createAssignment, getAssignmentCourses, deleteAssignmentCourse, updateAssignmentCourse, getAssignmentsByAdvisorID } = require('../controllers/assignmentCourse'); // Ensure this path matches your file structure

const router = express.Router();

// Route to create a new assignment
router.post('/', createAssignment).put('/:id', updateAssignmentCourse).delete('/:id', deleteAssignmentCourse).get('/getByAdvisor/:id', getAssignmentsByAdvisorID);
router.get('/assignmentCourses',getAssignmentCourses)

module.exports = router;
