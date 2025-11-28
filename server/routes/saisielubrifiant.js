const express = require("express");

// controller functions
const {
  createSaisieLubrifiant,
  deleteSaisieLubrifiant,
  getallsaisielubbymonth,
} = require("../controllers/saisielubrifiantController");

const authMiddleware = require("../middleware/authMiddleware");
// const allowedRoles = require("../middleware/allowedRoles");
const { ACTION } = require("../helpers/constantes");
const checkPermission = require("../middleware/checkPermission");

const router = express.Router();
const resource = "saisie_lubrifiants";

// require auth for all routes bellow
// router.use(authMiddleware);

router.post(
  "/createSaisieLubrifiant",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createSaisieLubrifiant
);
router.delete(
  "/deleteSaisieLubrifiant",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteSaisieLubrifiant
);
router.post(
  "/getallsaisielubbymonth",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getallsaisielubbymonth
);

module.exports = router;
