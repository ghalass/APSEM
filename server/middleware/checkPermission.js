const prisma = require("../config/prismaClient");
const jwt = require("jsonwebtoken");

/**
 *
 * @param {*} resource string
 * @param {*} action string
 * @returns
 */
const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { roles: { include: { permissions: true } } },
      });
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      // idAdmin Or SuperAdmin  ==> all permissions
      if (
        user.roles.some(
          (role) => role.name === "Admin" || role.name === "Super Admin"
        )
      )
        return next();

      // check permission
      const hasParmission = user.roles.some((role) =>
        role.permissions.some(
          (perm) => perm.resource === resource && perm.action === action
        )
      );
      if (!hasParmission)
        return res.status(403).json({ error: "Accès refusé" });

      next();
    } catch (error) {
      console.error("Check Permissions Middleware Error:", error);
    }
  };
};

module.exports = checkPermission;
