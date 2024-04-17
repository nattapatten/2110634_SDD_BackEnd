const SelectPath = require('../models/SelectPath');

// @desc    Create a new selectPath
// @route   POST /api/selectPaths
// @access  Public
exports.createSelectPath = async (req, res) => {
    try {
        const { studentID, pathID } = req.body;

        const newSelectPath = new SelectPath({
            studentID,
            pathID
        });

        const selectPath = await newSelectPath.save();

        res.status(201).json(selectPath);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Get all selectPaths
// @route   GET /api/selectPaths
// @access  Public
exports.getAllSelectPaths = async (req, res) => {
    try {
        const selectPaths = await SelectPath.find();
        res.status(200).json(selectPaths);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Delete a selectPath
// @route   DELETE /api/selectPaths/:id
// @access  Public
exports.deleteSelectPath = async (req, res) => {
    try {
        const selectPath = await SelectPath.findById(req.params.id);

        if (!selectPath) {
            return res.status(404).json({ error: 'SelectPath not found' });
        }

        await selectPath.remove();
        res.status(200).json({ message: 'SelectPath removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Update a selectPath
// @route   PUT /api/selectPaths/:id
// @access  Public
exports.updateSelectPath = async (req, res) => {
    try {
        const { studentID, pathID } = req.body;

        let selectPath = await SelectPath.findById(req.params.id);

        if (!selectPath) {
            return res.status(404).json({ error: 'SelectPath not found' });
        }

        selectPath.studentID = studentID;
        selectPath.pathID = pathID;

        selectPath = await selectPath.save();

        res.status(200).json(selectPath);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};
