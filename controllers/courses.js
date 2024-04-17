const Course = require("../models/Course");

exports.register = async (req, res, next) => {
  try {
    const { courseName, courseDetails, semester, year, advisorID } = req.body;

    const course = await Course.create({
      courseName,
      courseDetails,
      semester,
      year,
      advisorID,
    });
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};

//@desc Get all courses
//@route Get /api/v1/courses
//@access Public

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();
    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Get single course
//@route Get /api/v1/courses/:id
//@access Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(400).json({ success: false });

    res.status(200).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Create a course
//@route POST /api/v1/courses
//@access Private
exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Update single course
//@route PUT /api/v1/courses/:id
//@access Private
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) return res.status(400).json({ success: false });

    res.status(200).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Delete single course
//@route DELETE /api/v1/courses/:id
//@access Private

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(400).json({ success: false });

    res.status(200).json({ success: true, data: [] });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// Get courses by advisorID
// Route: GET /api/v1/courses/advisor/:advisorID
// Access: Public
exports.getCoursesByAdvisor = async (req, res, next) => {
  try {
    const advisorID = req.params.advisorID;
    const courses = await Course.find({ advisorID: advisorID });

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for the given advisor",
      });
    }

    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    res.status(400).json({ success: false });
    console.error(err);
  }
};
