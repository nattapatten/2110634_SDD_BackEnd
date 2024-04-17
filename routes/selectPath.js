const express = require('express');
const router = express.Router();
const selectPathController = require('../controllers/selectPath');

// Create a new selectPath
router.post('/selectPaths', selectPathController.createSelectPath);

// Get all selectPaths
router.get('/selectPaths', selectPathController.getAllSelectPaths);

// Delete a selectPath
router.delete('/selectPaths/:id', selectPathController.deleteSelectPath);

// Update a selectPath
router.put('/selectPaths/:id', selectPathController.updateSelectPath);

module.exports = router;
