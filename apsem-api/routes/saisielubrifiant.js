const express = require("express");

// controller functions
const {
  createSaisieLubrifiant,
  deleteSaisieLubrifiant,
  getallsaisielubbymonth,
} = require("../controllers/saisielubrifiantController");

const authMiddleware = require("../middleware/authMiddleware");
const allowedRoles = require("../middleware/allowedRoles");

const router = express.Router();

// require auth for all routes bellow
router.use(authMiddleware);

router.post(
  "/createSaisieLubrifiant",
  allowedRoles(["SUPER_ADMIN", "ADMIN", "AGENT_SAISIE"]),
  createSaisieLubrifiant
);
router.delete(
  "/deleteSaisieLubrifiant",
  allowedRoles(["SUPER_ADMIN", "ADMIN", "AGENT_SAISIE"]),
  deleteSaisieLubrifiant
);
router.post("/getallsaisielubbymonth", getallsaisielubbymonth);

module.exports = router;
