const express = require('express');
const router = express.Router();
const { createStudentAssignment } = require('../controllers/studentAssignment');

// POST route to create a new student assignment
router.post('/studentAssignments', createStudentAssignment);

module.exports = router;
