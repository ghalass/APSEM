const express = require("express");

// controller functions
const {
  createTypeparc,
  getTypeparcs,
  getTypeparc,
  deleteTypeparc,
  updateTypeparc,
} = require("../controllers/typeparcController");

const authMiddleware = require("../middleware/authMiddleware");
const { ACTION } = require("../helpers/constantes");
const checkPermission = require("../middleware/checkPermission");
// const allowedRoles = require("../middleware/allowedRoles");

const router = express.Router();

const resource = "typeparcs";

// require auth for all routes bellow
// router.use(authMiddleware);

router.get(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getTypeparcs
);

// GET single workout
router.get("/:id", getTypeparc);

// POST a new workout
router.post(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createTypeparc
);

// UPDATE a workout
router.patch(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.UPDATE),
  updateTypeparc
);

// DELETE a workout
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteTypeparc
);

module.exports = router;
