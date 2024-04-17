const express = require("express");
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const router = express.Router();

// Middleware to protect routes
const { protect } = require("../middleware/auth");

// GET all courses (Public access)
router.get("/getCourses", getCourses);

// GET a single company by ID (Public access)
router.get("/getCourse/:id", getCourse);

// POST a new company (Protected)
// router.post("/createCourse", protect, createCourse);
router.post("/createCourse", createCourse);
// PUT to update a company by ID (Protected)
// router.put("/updateCourse/:id", protect, updateCourse);
router.put("/updateCourse/:id", updateCourse);
// DELETE a company by ID (Protected)
// router.delete("/deleteCourse/:id", protect, deleteCourse);
router.delete("/deleteCourse/:id", deleteCourse);

// Get courses by advisorID
// Route: GET /api/v1/courses/advisor/:advisorID
// Access: Public
router.get("/getCoursesByAdvisor/:advisorID", getCoursesByAdvisor);

module.exports = router;
