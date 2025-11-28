const express = require("express");

// controller functions
const {
  createTypelubrifiant,
  getTypelubrifiant,
  // getTypepanne,
  deleteTypelubrifiant,
  updateTypelubrifiant,
} = require("../controllers/typelubrifiantController");

const authMiddleware = require("../middleware/authMiddleware");
// const allowedRoles = require("../middleware/allowedRoles");
const { ACTION } = require("../helpers/constantes");
const checkPermission = require("../middleware/checkPermission");

const router = express.Router();
const resource = "type_lubrifiants";

// require auth for all routes bellow
// router.use(authMiddleware);

router.get(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getTypelubrifiant
);

// // GET single workout
// router.get('/:id', getTypepanne)

// POST a new workout
router.post(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createTypelubrifiant
);

// UPDATE a workout
router.patch(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.UPDATE),
  updateTypelubrifiant
);

// DELETE a workout
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteTypelubrifiant
);

module.exports = router;
