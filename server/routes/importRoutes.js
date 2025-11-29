// routes/importRoutes.js
const express = require("express");
const router = express.Router();
const { importData } = require("../controllers/importController");

router.post("/", importData);

module.exports = router;
