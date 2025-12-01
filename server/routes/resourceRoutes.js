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
const checkPermission = require("../middleware/checkPermission");
const { ACTION } = require("../helpers/constantes");
// const allowedRoles = require("../middleware/allowedRoles");
// const verifyJWT = require('../middleware/verifyJWT')

const router = express.Router();
const resource = "resources";

// require auth for all routes bellow
// router.use(authMiddleware);
// router.use(verifyJWT)

// GET all
router.get(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getResources
);

// GET single workout
router.get(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getResource
);

// POST a new workout
router.post(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createResource
);

// UPDATE a workout
router.patch(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.UPDATE),
  updateResource
);

// DELETE a workout
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteResource
);

module.exports = router;
