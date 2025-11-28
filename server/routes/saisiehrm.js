const express = require("express");

// controller functions
const {
  get_byengin_and_date,

  createSaisieHrm,
  updateSaisieHrm,

  createSaisieHim,
  deleteSaisieHim,
  updateSaisieHim,

  getSaisieHrm,
  getSaisieHrmDay,

  injectSaisieHrm,
  injectSaisieHim,
} = require("../controllers/saisiehrmController");

const authMiddleware = require("../middleware/authMiddleware");
// const allowedRoles = require("../middleware/allowedRoles");
const { ACTION } = require("../helpers/constantes");
const checkPermission = require("../middleware/checkPermission");

const router = express.Router();
const resource = "saisie_hrms";

// require auth for all routes bellow
// router.use(authMiddleware);

router.post(
  "/getSaisieHrm",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getSaisieHrm
);

router.post(
  "/createSaisieHrm",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createSaisieHrm
);
router.post(
  "/injectSaisieHrm",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  injectSaisieHrm
);
router.patch(
  "/updateSaisieHrm",
  authMiddleware,
  checkPermission(resource, ACTION.UPDATE),
  updateSaisieHrm
);

router.post(
  "/createSaisieHim",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createSaisieHim
);
router.post(
  "/injectSaisieHim",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  injectSaisieHim
);

router.delete(
  "/deleteSaisieHim",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteSaisieHim
);
router.patch(
  "/updateSaisieHim",
  authMiddleware,
  checkPermission(resource, ACTION.UPDATE),
  updateSaisieHim
);

router.post(
  "/getSaisieHrmDay",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getSaisieHrmDay
);

router.post(
  "/byengin_and_date",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  get_byengin_and_date
);

module.exports = router;
