const { authorize } = require('../middleware/auth');
const Course = require('../models/Course');

//@desc		Get single course
//@route	GET /api/v1/courses
//@access	Public
exports.getCoursebyCourseID = async (req, res, next) => {
    console.log("getCoursebyCourseID");
    // const course = await Course.find({ courseID: req.body.courseID });
    // console.log(course);
	try {
		const course = await Course.find({ courseID: req.body.courseID });
		if (!course) {
			return res.status(404).json({ success: false, message: `No course with the id of ${req.params.id}`});
		}
		res.status(200).json({
			success: true,
			data: course
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ success: false, message: "Cannot find course" });
	}
};

//@desc		Get single course
//@route	GET /api/v1/courses
//@access	Public
exports.getCourses = async (req, res, next) => {
    console.log("getCourses");

    let query;

    //Copy req.query
    const reqQuery = {...req.query};

    //Fields to exclude
    const removeFields = ['select','sort','page','limit'];

    //Loop over remove fields and delete them fron reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery&"thsisi");

    //Create query string
    let queryStr = JSON.stringify(req.query);
    //Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

    //finding resource
    query = Course.find(JSON.parse(queryStr));

    //Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    //Sort
    if (req.query.Sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('courseID');
    }

    //Pagination
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
        const total = await Course.countDocuments();
        query = query.skip(startIndex).limit(limit);
        //Execute query
        const courses = await query;

        //Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }
        res.status(200).json({ success: true, count: courses.length,pagination, data: courses });
    }
    catch (err) {
        res.status(400).json({ success: false });
    }

};

//@desc		create course
//@route	POST /api/v1/course
//@access	Private
exports.createCourse = async (req, res, next) => {
	console.log("createCourse")
	try {
		const course = await Course.create(req.body);
		res.status(201).json({ success: true, data: course });
	} catch (err) {
		res.status(400).json({ success: false });
		console.log(err.stack);
	}
};

//@desc		Update courses
//@route	PUT /api/v1/courses/
//@access	Private
exports.updateCourse = async (req, res, next) => {
	console.log("updateCourse")
	try {
		const course = await Course.findOneAndUpdate({courseID: req.body.courseID}, req.body, {
			new: true,
			runValidators: true
		});
		if (!course) {
			return res.status(404).json({
				success: false,
				msg: 'course not found'
			});
		}
		res.status(200).json({
			success: true,
			data: course
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Cannot update Course"
		});
	}
};

// Delete user
// route DELETE /api/v1/course
// access Private/Admin
exports.deleteCourse = async (req, res, next) => {
	console.log("delete Course")
	console.log({ courseID: req.body.courseID })
	try {
		const course = await Course.deleteOne({ courseID: req.body.courseID });
		if (!course) {
			return res.status(404).json({
				success: false,
				msg: 'course not found'
			});
		}
		res.status(200).json({
			success: true,
			data: {}
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			msg: err.message
		});
	}
};