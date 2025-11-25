const express = require("express");

// controller functions
const {
  createResource,
  getResources,
  getResource,
  deleteResource,
  updateResource,
} = require("../controllers/resourceController");

const authMiddleware = require("../middleware/authMiddleware");
const allowedRoles = require("../middleware/allowedRoles");
// const verifyJWT = require('../middleware/verifyJWT')

const router = express.Router();

// require auth for all routes bellow
router.use(authMiddleware);
// router.use(verifyJWT)

// GET all
router.get("/", getResources);

// GET single workout
router.get("/:id", getResource);

// POST a new workout
router.post("/", createResource);

// UPDATE a workout
router.patch("/:id", updateResource);

// DELETE a workout
router.delete("/:id", deleteResource);

module.exports = router;
