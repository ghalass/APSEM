const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
// controller functions
const { getDashboard } = require("../controllers/dashboardController");

const router = express.Router();

// GET all
router.get("/", authMiddleware, getDashboard);

module.exports = router;
