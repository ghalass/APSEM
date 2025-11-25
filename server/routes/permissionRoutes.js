const express = require("express");

// controller functions
const {
  getPermission,
  updatePermission,
  deletePermission,
  createPermission,
  getPermissions,
} = require("../controllers/permissionController");

const authMiddleware = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");

const router = express.Router();

// GET ALL PERMISSIONS
router.get(
  "/",
  authMiddleware,
  checkPermission("permissions", "READ"),
  getPermissions
);

// GET PERMISSION BY ID
router.get(
  "/:id",
  authMiddleware,
  checkPermission("permissions", "READ"),
  getPermission
);

router.post(
  "/",
  authMiddleware,
  checkPermission("permissions", "CREATE"),
  createPermission
);

// UPDATE AN PERMISSION
router.patch(
  "/",
  authMiddleware,
  checkPermission("permissions", "UPDATE"),
  updatePermission
);

// DELETE AN PERMISSION
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("permissions", "DELETE"),
  deletePermission
);

module.exports = router;
