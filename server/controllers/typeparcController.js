const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");
// get all
const getTypeparcs = async (req, res) => {
  try {
    const typeparcs = await prisma.typeparc.findMany({
      orderBy: { name: "asc" },
    });
    res.status(HttpStatus.OK).json(typeparcs);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// get a single typeparc
const getTypeparc = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const typeparc = await prisma.typeparc.findFirst({
      where: { id },
    });

    if (!typeparc) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    res.status(HttpStatus.OK).json(typeparc);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// create new typeparc
const createTypeparc = async (req, res) => {
  const { name } = req.body;

  let emptyFields = [];

  if (!name) emptyFields.push("name");

  if (emptyFields.length > 0) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "Veuillez remplir tout les champs!", emptyFields });
  }

  try {
    const exists = await prisma.typeparc.findFirst({
      where: { name: name },
    });

    if (exists) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Typeparc déjà utilisé" });
    }

    const typeparc = await prisma.typeparc.create({
      data: { name },
    });
    res.status(HttpStatus.CREATED).json(typeparc);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// delete a typeparc
const deleteTypeparc = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const typeparc = await prisma.typeparc.findFirst({
      where: { id },
    });

    if (!typeparc) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    // check if typeparc has parcs
    const parc = await prisma.parc.findFirst({
      where: { typeparcId },
    });
    if (parc) {
      return res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
        error:
          "Impossible de supprimer cet élément car il est référencé ailleurs.",
      });
    }

    await prisma.typeparc.delete({
      where: { id },
    });

    res.status(HttpStatus.OK).json(typeparc);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// update a typeparc
const updateTypeparc = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const typeparc = await prisma.typeparc.findFirst({
      where: { id },
    });

    // check if name not already exist
    const nameExist = await prisma.typeparc.findFirst({
      where: { name: name, id: { not: id } },
    });
    if (nameExist) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Nom déjà utilisé!" });
    }

    if (!typeparc) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const updatedWorkout = await prisma.typeparc.update({
      where: { id },
      data: { name },
    });

    res.status(HttpStatus.OK).json(updatedWorkout);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = {
  createTypeparc,
  getTypeparcs,
  getTypeparc,
  deleteTypeparc,
  updateTypeparc,
};
