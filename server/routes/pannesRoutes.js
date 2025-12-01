const express = require("express");

// controller functions
const {
  createPanne,
  getPannes,
  getPanne,
  deletePanne,
  updatePanne,
  fetchPannesByTypepanne,
} = require("../controllers/panneController");

const authMiddleware = require("../middleware/authMiddleware");
// const allowedRoles = require("../middleware/allowedRoles");
const { ACTION } = require("../helpers/constantes");
const checkPermission = require("../middleware/checkPermission");

const router = express.Router();
const resource = "pannes";

// require auth for all routes bellow
// router.use(authMiddleware);

router.get(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getPannes
);

// GET single workout
router.get(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getPanne
);

// GET single workout
router.get(
  "/typepanne/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  fetchPannesByTypepanne
);

// POST a new workout
router.post(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createPanne
);

// UPDATE a workout
router.patch(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.UPDATE),
  updatePanne
);

// DELETE a workout
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deletePanne
);

module.exports = router;
