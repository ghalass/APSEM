const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");

// get all
const getPermissions = async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: [{ resource: "asc" }, { action: "asc" }],
    });
    res.status(HttpStatus.OK).json(permissions);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// get a single permission
// const getPermission = async (req, res) => {
//   const { id } = req.params;
//   try {
//     if (id === undefined) {
//       return res.status(HttpStatus.NOT_FOUND).json({ error: "Enregistrement n'existe pas!" });
//     }

//     const permission = await prisma.permission.findFirst({
//       where: { id },
//     });

//     if (!permission) {
//       return res.status(HttpStatus.NOT_FOUND).json({ error: "Enregistrement n'existe pas!" });
//     }

//     res.status(HttpStatus.OK).json(permission);
//   } catch (error) {
//     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
//   }
// };

// create new permission
const createPermission = async (req, res) => {
  try {
    const { resource, action } = req.body;

    let emptyFields = [];

    if (!resource) emptyFields.push("resource");
    if (!action) emptyFields.push("action");

    if (emptyFields.length > 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Veuillez remplir tout les champs!", emptyFields });
    }

    // check if permission exist
    const existingPermission = await prisma.permission.findFirst({
      where: { resource, action },
    });

    if (existingPermission) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ error: "Permission existe déjà" });
    }

    // create permission
    const permission = await prisma.permission.create({
      data: { resource, action },
    });
    res.status(HttpStatus.CREATED).json(permission);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// delete a permission
const deletePermission = async (req, res) => {
  const { id } = req.params;
  try {
    if (id === undefined) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const permission = await prisma.permission.findFirst({
      where: { id },
    });

    if (!permission) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    await prisma.permission.delete({
      where: { id },
    });

    res.status(HttpStatus.OK).json(permission);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// // update a permission
// const updatePermission = async (req, res) => {
//   const { id } = req.params;
//   const { name } = req.body;
//   try {
//     if (id === undefined || parseInt(id) != id) {
//       return res
//         .status(HttpStatus.NOT_FOUND)
//         .json({ error: "Enregistrement n'est pas trouvé!" });
//     }

//     const permission = await prisma.permission.findFirst({
//       where: { id },
//     });

//     // check if name not already exist
//     const nameExist = await prisma.permission.findFirst({
//       where: { name: name, id: { not: id } },
//     });
//     if (nameExist) {
//       return res
//         .status(HttpStatus.BAD_REQUEST)
//         .json({ error: "Nom déjà utilisé!" });
//     }

//     if (!permission) {
//       return res.status(HttpStatus.NOT_FOUND).json({ error: "Enregistrement n'existe pas!" });
//     }

//     const updatedWorkout = await prisma.permission.update({
//       where: { id },
//       data: { name },
//     });

//     res.status(HttpStatus.OK).json(updatedWorkout);
//   } catch (error) {
//     res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
//   }
// };

module.exports = {
  createPermission,
  getPermissions,
  // getPermission,
  deletePermission,
  // updatePermission,
};
