const express = require("express");

// controller functions
const {
  createParc,
  getParcs,
  getParc,
  deleteParc,
  updateParc,
  getParcsByTypeparc,
} = require("../controllers/parcController");

const authMiddleware = require("../middleware/authMiddleware");
// const allowedRoles = require("../middleware/allowedRoles");
const checkPermission = require("../middleware/checkPermission");
const { ACTION } = require("../helpers/constantes");

const router = express.Router();
const resource = "parcs";

// require auth for all routes bellow
// router.use(authMiddleware);

router.get(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getParcs
);

// GET single workout
router.get(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getParc
);

// GET single workout
router.get(
  "/typeparc/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getParcsByTypeparc
);

// POST a new workout
router.post(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createParc
);

// UPDATE a workout
router.patch(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.UPDATE),
  updateParc
);

// DELETE a workout
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteParc
);

module.exports = router;
