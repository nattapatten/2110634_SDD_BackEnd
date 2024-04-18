const mongoose = require('mongoose');

const SelectPathSchema = new mongoose.Schema({
    Description: {
        type: String,
        required: [true, 'Please add a Description']
    },
    pathID: {
        type: String,
        required: [true, 'Please add a path ID']
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model('SelectPath', SelectPathSchema);
