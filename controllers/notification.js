const Notification = require("../models/Notification");
const Advisor = require('../models/Advisor');
const StudentSelectPath = require('../models/StudentSelectPath')

exports.getNotifications = async (req, res, next) => {
    let query;

    const reqQuery = { ...req.query };

    const removeField = ["select", "sort", "page", "limit"];
    removeField.forEach((param) => delete reqQuery[param]);
    console.log(reqQuery);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );
    query = Notification.find(JSON.parse(queryStr));

    //Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    //Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    } else {
        query = query.sort("-createdAt");
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Notification.countDocuments();

    query = query.skip(startIndex).limit(limit);

    try {
        const notifications = await query;

        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }

        console.log(req.query);
        res
            .status(200)
            .json({
                success: true,
                count: notifications.length,
                pagination,
                data: notifications,
            });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}


exports.getNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: notification });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};



exports.createNotification = async (req, res, next) => {
    const notification = await Notification.create(req.body);
    res.status(201).json({
        success: true,
        data: notification,
    });
};



exports.updateNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!notification) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: notification });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

exports.deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(400).json({ success: false });
        }

        await notification.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false });
    }
};

//This Version Can Connect to MongoDB

exports.getNotificationsByAdvisorID = async (req, res, next) => {
    try {
        // Extract advisorID from the request parameters
        const { advisorID } = req.params;

        // Find the advisor by advisorID
        const advisor = await Advisor.findOne({ advisorID: advisorID });
        if (!advisor) {
            return res.status(404).json({
                success: false,
                message: 'Advisor not found'
            });
        }

        // Extract the list of courseIDs from the advisor document
        const { courses } = advisor;

        // Check if courses array exists and is not empty
        if (!courses || courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No courses found for this advisor'
            });
        }

        // Find all Notifications that match the courseIDs from the advisor's courses list
        const notifications = await Notification.find({ courseID: { $in: courses } }).sort('-createdAt');

        // Check if notifications are found
        if (!notifications || notifications.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No notifications found for the given courses'
            });
        }

        // Return the found notifications
        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Error fetching notifications by advisor ID:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};






exports.getNotificationsByStudentD = async (req, res, next) => {
    try {
        // Extract studentID from the request parameters
        const { studentID } = req.params;

        console.log("studentID", studentID);

        // Find the student path by studentID
        const studentPath = await StudentSelectPath.findOne({ studentID: studentID });
        if (!studentPath) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Assuming courses is a property that contains an array of course objects
        const courses = studentPath.courses;

        console.log("studentPath.courses", courses);

        // Extract courseIDs from the courses array
        const courseIDs = courses.map(course => course.courseID);

        console.log("Extracted courseIDs", courseIDs);

        // Check if the courseIDs array exists and is not empty
        if (!courseIDs || courseIDs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No courses found for this student'
            });
        }

        // Find all Notifications that match the courseIDs from the student's courses list
        const notifications = await Notification.find({ courseID: { $in: courseIDs } }).sort('-createdAt');

        // Check if notifications are found
        if (!notifications || notifications.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No notifications found for the given courses'
            });
        }

        // Return the found notifications
        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Error fetching notifications by student ID:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};