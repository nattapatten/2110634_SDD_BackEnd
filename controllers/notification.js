const Notification = require("../models/Notification");

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
