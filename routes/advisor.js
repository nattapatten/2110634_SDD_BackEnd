const express = require('express');
const {
    getAdvisors,
    createAdvisor,
    updateAdvisor,
    deleteAdvisor,
    getAdvisorById  // Make sure to import this
} = require('../controllers/advisor');  // Ensure correct file path and exports

const router = express.Router();

// Route to get all advisors
router.get('/advisors', getAdvisors);

// Route to create a new advisor
router.post('/', createAdvisor);

// Route to update and delete an advisor by ID
router.route('/:id')
    .put(updateAdvisor)
    .delete(deleteAdvisor);

// Route to get a single advisor by advisorID
router.get('/:advisorID', getAdvisorById);

module.exports = router;
