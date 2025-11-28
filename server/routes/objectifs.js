const express = require("express");

// controller functions
const {
  createObjectif,
  getObjectifs,
  getObjectif,
  deleteObjectif,
  updateObjectif,
} = require("../controllers/objectifController");

const authMiddleware = require("../middleware/authMiddleware");
// const allowedRoles = require("../middleware/allowedRoles");
const checkPermission = require("../middleware/checkPermission");
const { ACTION } = require("../helpers/constantes");
// const verifyJWT = require('../middleware/verifyJWT')

const router = express.Router();
const resource = "objectifs";

// require auth for all routes bellow
// router.use(authMiddleware);
// router.use(verifyJWT)

// GET all
router.get(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getObjectifs
);

// GET single workout
router.get(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getObjectif
);

// POST a new workout
router.post(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createObjectif
);

// UPDATE a workout
router.patch(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.UPDATE),
  updateObjectif
);

// DELETE a workout
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteObjectif
);

module.exports = router;
