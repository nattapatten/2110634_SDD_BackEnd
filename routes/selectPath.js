const express = require("express");
const router = express.Router();
const SelectPath = require("../controllers/selectPath");

// Create a new selectPath
router.post("/selectPaths", SelectPath.createSelectPath);

// Get all selectPaths
router.get("/selectPaths", SelectPath.getAllSelectPaths);

// Delete a selectPath
router.delete("/selectPaths/:id", SelectPath.deleteSelectPath);

// Update a selectPath
router.put("/selectPaths/:id", SelectPath.updateSelectPath);

module.exports = router;
