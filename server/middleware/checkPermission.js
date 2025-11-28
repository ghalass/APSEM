const prisma = require("../config/prismaClient");
const { ACTION } = require("../helpers/constantes");

// const checkPermission = (resource, action) => {
//   return async (req, res, next) => {
//     try {
//       const user = await prisma.user.findUnique({
//         where: { id: req.user.id },
//         include: { roles: { include: { permissions: true } } },
//       });
//       if (!user) {
//         return res.status(404).json({ error: "Utilisateur non trouvé" });
//       }
//       // idAdmin Or SuperAdmin  ==> all permissions
//       if (
//         user.roles.some(
//           (role) => role.name === "Admin" || role.name === "Super Admin"
//         )
//       )
//         return next();
//       // console.log(user);
//       console.log(JSON.stringify(user.roles));

//       // check permission
//       const hasParmission = user.roles.some((role) =>
//         role.permissions.some(
//           (perm) => perm.resource === resource && perm.action === action
//         )
//       );
//       // console.log(hasParmission);

//       if (!hasParmission)
//         return res.status(403).json({ error: "Accès refusé" });

//       next();
//     } catch (error) {
//       console.error("Check Permissions Middleware Error:", error);
//     }
//   };
// };
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

      // DEBUG: Afficher ce qui est cherché
      // console.log(`######################`);
      // console.log(`🔍 Recherche: ${resource}.${action}`);
      // console.log(`👤 Utilisateur: ${user.name} (${user.email})`);

      // Admin check
      const isAdmin = user.roles.some(
        (role) => role.name === "Admin" || role.name === "Super Admin"
      );

      if (isAdmin) {
        // console.log("✅ Accès admin - autorisé");
        return next();
      }

      // Permission check avec debug
      let permissionFound = false;

      user.roles.forEach((role) => {
        role.permissions.forEach((perm) => {
          // console.log`   📋 Permission disponible: ${perm.resource}.${perm.action}`();
          if (perm.resource === resource && perm.action === action) {
            permissionFound = true;
            // console.log(`   ✅ MATCH: ${resource}.${action} trouvé!`);
          }
        });
      });

      if (!permissionFound) {
        // console.log(`❌ Permission ${resource}.${action} NON trouvée`);
        let msg = "Vous n'avez pas les permissions nécessaires pour ";
        switch (action) {
          case ACTION.CREATE:
            msg += "la création";
            break;
          case ACTION.READ:
            msg += "accéder à ce contenu";
            break;
          case ACTION.UPDATE:
            msg += "la modification";
            break;
          case ACTION.DELETE:
            msg += "la suppression";
            break;
          default:
            break;
        }
        return res.status(403).json({ error: msg });
      }

      // console.log(`✅ Permission ${resource}.${action} accordée`);
      next();
    } catch (error) {
      console.error("Check Permissions Middleware Error:", error);
    }
  };
};
module.exports = checkPermission;
