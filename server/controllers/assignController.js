const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");

// create new role
const assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    let emptyFields = [];

    if (!userId) emptyFields.push("userId");
    if (!roleId) emptyFields.push("roleId");

    if (emptyFields.length > 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Veuillez remplir tout les champs!", emptyFields });
    }

    // check if user exist
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: { roles: true },
    });
    if (!user)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Utilisateur n'existe pas" });

    // check if role exist
    const role = await prisma.role.findFirst({
      where: { id: roleId },
    });
    if (!role)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Rôle n'existe pas" });

    // check if role exists
    const hasRole = user.roles.some((r) => r.id === roleId);
    if (!role)
      return res
        .status(HttpStatus.CONFLICT)
        .json({ error: "Rôle est déjà donné à cet utilisateur" });

    // assign role to user
    const assign = await prisma.user.update({
      where: { id: userId },
      data: { roles: { connect: { id: roleId } } },
    });
    res.status(HttpStatus.OK).json({ message: "Rôle donné à l'utilisateur" });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

const assignPermissionRole = async (req, res) => {
  try {
    const { roleId, permissionId } = req.body;

    let emptyFields = [];

    if (!roleId) emptyFields.push("roleId");
    if (!permissionId) emptyFields.push("permissionId");

    if (emptyFields.length > 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Veuillez remplir tout les champs!", emptyFields });
    }

    // check if role exist
    const role = await prisma.role.findFirst({
      where: { id: roleId },
      include: { permissions: true },
    });
    if (!role)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Rôle n'existe pas" });

    // check if permission exist
    const permission = await prisma.permission.findFirst({
      where: { id: permissionId },
    });
    if (!permission)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Permission n'existe pas" });

    // check if permission already assigned
    // console.log(role);

    const hasPermission = role.permissions.some((p) => p.id === permissionId);
    if (hasPermission)
      return res
        .status(HttpStatus.CONFLICT)
        .json({ error: "Permission est déjà donnée à ce rôle" });

    // assign permission to role
    const assign = await prisma.role.update({
      where: { id: roleId },
      data: { permissions: { connect: { id: permissionId } } },
    });
    res.status(HttpStatus.OK).json({ message: "Permission donné à ce rôle" });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

const deleteRelationPermissionRole = async (req, res) => {
  try {
    const { roleId, permissionId } = req.body;

    // Pour supprimer une permission spécifique d'un rôle
    await prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          disconnect: { id: permissionId },
        },
      },
    });
    res
      .status(HttpStatus.OK)
      .json({ message: "Permission supprimé avec succès" });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = {
  assignRoleToUser,
  assignPermissionRole,
  deleteRelationPermissionRole,
};
