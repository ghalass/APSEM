const express = require("express");

// controller functions
const {
  getPermission,
  // updatePermission,
  deletePermission,
  createPermission,
  getPermissions,
} = require("../controllers/permissionController");

const authMiddleware = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");
const { ACTION } = require("../helpers/constantes");

const router = express.Router();
const resource = "permissions";

// GET ALL PERMISSIONS
router.get(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getPermissions
);

// GET PERMISSION BY ID
// router.get(
//   "/:id",
//   authMiddleware,
//   checkPermission("permissions", "READ"),
//   getPermission
// );

router.post(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createPermission
);

// UPDATE AN PERMISSION
// router.patch(
//   "/",
//   authMiddleware,
//   checkPermission("permissions", "UPDATE"),
//   updatePermission
// );

// DELETE AN PERMISSION
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deletePermission
);

module.exports = router;
