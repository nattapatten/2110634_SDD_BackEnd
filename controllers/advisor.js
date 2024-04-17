const Advisor = require('../models/Advisor');

exports.getAdvisors = async (req, res, next) => {
    const advisors = await Advisor.find();
    res.status(200).json(
        {
            success: true,
            data: advisors
        }
    )
};

exports.getAdvisorById = async (req, res, next) => {
    console.log(req)
    try {
        const advisor = await Advisor.findOne({ advisorID: req.params.advisorID });

        if (!advisor) {
            return res.status(404).json({
                success: false,
                msg: 'Advisor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: advisor
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: err.message
        });
    }
};


exports.createAdvisor = async (req, res, next) => {
    try {
        const newAdvisor = new Advisor(req.body);
        await newAdvisor.save();
        res.status(201).json({
            success: true,
            data: newAdvisor
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};


exports.updateAdvisor = async (req, res, next) => {
    try {
        const user = await Advisor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Advisor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: err.message
        });
    }
};

exports.deleteAdvisor = async (req, res, next) => {
    try {
        const advisor = await Advisor.findByIdAndDelete(req.params.id);

        if (!advisor) {
            return res.status(404).json({
                success: false,
                msg: 'Advisor not found'
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
