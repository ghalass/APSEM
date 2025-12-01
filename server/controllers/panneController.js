const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");
// get all
const getPannes = async (req, res) => {
  try {
    const pannes = await prisma.panne.findMany({
      include: { Typepanne: true },
      orderBy: { name: "asc" },
    });
    res.status(HttpStatus.OK).json(pannes);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// get a single panne
const getPanne = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const panne = await prisma.panne.findFirst({
      include: { Typepanne: true },
      where: { id },
    });

    if (!panne) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    res.status(HttpStatus.OK).json(panne);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// create new panne
const createPanne = async (req, res) => {
  // return res.status(HttpStatus.CREATED).json(req.body)
  try {
    const { name, typepanneId } = req.body;

    let emptyFields = [];

    if (!name) emptyFields.push("name");
    if (!typepanneId) emptyFields.push("typepanneId");

    if (emptyFields.length > 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Veuillez remplir tout les champs!", emptyFields });
    }

    const exists = await prisma.panne.findFirst({
      where: { name },
    });

    if (exists) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Panne déjà utilisé" });
    }

    const panne = await prisma.panne.create({
      data: { name, typepanneId: typepanneId },
    });
    res.status(HttpStatus.CREATED).json(panne);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// delete a panne
const deletePanne = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const panne = await prisma.panne.findFirst({
      where: { id },
    });
    if (!panne) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    await prisma.panne.delete({
      where: { id },
    });

    res.status(HttpStatus.OK).json(panne);
  } catch (error) {
    console.warn(error);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// update a panne
const updatePanne = async (req, res) => {
  const { id } = req.params;
  const { name, typepanneId } = req.body;

  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const panne = await prisma.panne.findFirst({
      where: { id },
    });

    // check if name not already exist
    const nameExist = await prisma.panne.findFirst({
      where: { name, id: { not: id } },
    });
    if (nameExist) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error: "Nom déjà utilisé!" });
    }

    if (!panne) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const updatedWorkout = await prisma.panne.update({
      where: { id },
      data: { name, typepanneId: typepanneId },
    });

    res.status(HttpStatus.OK).json(updatedWorkout);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

const fetchPannesByTypepanne = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const panne = await prisma.panne.findMany({
      include: { Typepanne: true },
      where: { typepanneId: id },
    });

    if (!panne) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    res.status(HttpStatus.OK).json(panne);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

module.exports = {
  createPanne,
  getPannes,
  getPanne,
  deletePanne,
  updatePanne,
  fetchPannesByTypepanne,
};
