const { authorize } = require('../middleware/auth');
const Course = require('../models/Course');

exports.getCourses = async (req, res, next) => {
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
    query = Course.find(JSON.parse(queryStr)).populate('assignment');

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
        query = query.sort('dueDate');
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

//@desc     Get single hospitals
//@route    GET /api/v1/hospitals/:id
//@access   Public
exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: course });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

//@desc     Create new hospitals
//@route    POST /api/v1/hospitals
//@access   Private
exports.createCourse = async (req, res, next) => {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
};

//@desc     Update new Course 
//@route    PUT /api/v1/Course/:id
//@access   Private
exports.updateCourse = async (req, res, next) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!course) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: course });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

//@desc     Delete hospitals
//@route    DELETE /api/v1/hospitals/:id
//@access   Private
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
       
        if (!course) {
            return res.status(400).json({ success: false });
        }
        await course.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};