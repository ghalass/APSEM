const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");

// get all
const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { name: "desc" },
      include: {
        permissions: {
          orderBy: {
            resource: "asc",
          },
        },
      },
    });
    res.status(HttpStatus.OK).json(roles);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// get a single role
const getRole = async (req, res) => {
  const { id } = req.params;
  try {
    if (isNaN(id)) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const role = await prisma.role.findFirst({
      where: { id },
      include: { permissions: true },
    });

    if (!role) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    res.status(HttpStatus.OK).json(role);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// create new role
const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    let emptyFields = [];

    if (!name) emptyFields.push("name");
    // if (!permissions) emptyFields.push("permissions");

    if (
      emptyFields.length > 0
      // ||
      // !Array.isArray(permissions) ||
      // permissions.length === 0
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Veuillez remplir tout les champs!", emptyFields });
    }

    // check if role exist
    const existingRole = await prisma.role.findFirst({
      where: { name: name },
    });

    if (existingRole) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ error: "Role déjà utilisé" });
    }

    // create role
    const role = await prisma.role.create({
      data: {
        name,
        // permissions: {
        //   create: permissions.map(({ resource, action }) => ({
        //     resource,
        //     action,
        //   })),
        // },
      },
      // include: { permissions: true },
    });
    res.status(HttpStatus.CREATED).json(role);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// delete a role
const deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    if (id === undefined) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const role = await prisma.role.findFirst({
      where: { id },
    });

    if (!role) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    await prisma.role.delete({
      where: { id },
    });

    res.status(HttpStatus.OK).json(role);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// update a role
const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const role = await prisma.role.findFirst({
      where: { id },
    });

    // check if name not already exist
    const nameExist = await prisma.role.findFirst({
      where: { name: name, id: { not: id } },
    });
    if (nameExist) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Nom déjà utilisé!" });
    }

    if (!role) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const updatedWorkout = await prisma.role.update({
      where: { id },
      data: { name },
      include: { permissions: true },
    });

    res.status(HttpStatus.OK).json(updatedWorkout);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = {
  createRole,
  getRoles,
  getRole,
  deleteRole,
  updateRole,
};
