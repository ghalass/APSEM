const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");
// get all
const getTypelubrifiant = async (req, res) => {
  try {
    const typepannes = await prisma.typelubrifiant.findMany({
      orderBy: { name: "asc" },
    });
    res.status(HttpStatus.OK).json(typepannes);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// get a single typepanne
// const getTypepanne = async (req, res) => {
//     const { id } = req.params
//     try {

//         if (!id) {
//             return res.status(HttpStatus.NOT_FOUND).json({ error: "Enregistrement n'existe pas!" });
//         }

//         const typepanne = await prisma.typepanne.findFirst({
//             where: { id }
//         });

//         if (!typepanne) {
//             return res.status(HttpStatus.NOT_FOUND).json({ error: "Enregistrement n'existe pas!" })
//         }

//         res.status(HttpStatus.OK).json(typepanne)
//     } catch (error) {
//         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
//     }
// }

// create new typepanne
const createTypelubrifiant = async (req, res) => {
  try {
    const { name } = req.body;

    let emptyFields = [];

    if (!name) emptyFields.push("name");

    if (emptyFields.length > 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Veuillez remplir tout les champs!", emptyFields });
    }
    const exists = await prisma.typelubrifiant.findFirst({
      where: { name: name },
    });

    if (exists) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Typelubrifiant déjà utilisé" });
    }

    const created = await prisma.typelubrifiant.create({
      data: { name },
    });
    res.status(HttpStatus.CREATED).json(created);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// delete a typepanne
const deleteTypelubrifiant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const typelubrifiant = await prisma.typelubrifiant.findFirst({
      where: { id },
    });

    if (!typelubrifiant) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    // check if typelubrifiant has pannes
    const lubrifiant = await prisma.lubrifiant.findFirst({
      where: { typelubrifiantId },
    });
    if (lubrifiant) {
      return res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
        error:
          "Impossible de supprimer cet élément car il est référencé ailleurs.",
      });
    }

    await prisma.typelubrifiant.delete({
      where: { id },
    });

    res.status(HttpStatus.OK).json(typelubrifiant);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// update a typepanne
const updateTypelubrifiant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const typelubrifiant = await prisma.typelubrifiant.findFirst({
      where: { id },
    });

    // check if name not already exist
    const nameExist = await prisma.typelubrifiant.findFirst({
      where: { name: name, id: { not: id } },
    });
    if (nameExist) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Nom déjà utilisé!" });
    }

    if (!typelubrifiant) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const created = await prisma.typelubrifiant.update({
      where: { id },
      data: { name },
    });

    res.status(HttpStatus.OK).json(created);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = {
  createTypelubrifiant,
  getTypelubrifiant,
  // getTypepanne,
  deleteTypelubrifiant,
  updateTypelubrifiant,
};
