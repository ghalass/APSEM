const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");
// get all
const getParcs = async (req, res) => {
  try {
    const parcs = await prisma.parc.findMany({
      include: { Typeparc: true },
      orderBy: { name: "asc" },
    });
    res.status(HttpStatus.OK).json(parcs);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getParcsByTypeparc = async (req, res) => {
  try {
    const { id } = req.params;
    const parcs = await prisma.parc.findMany({
      where: { typeparcId: id },
      include: { Typeparc: true },
      orderBy: { name: "asc" },
    });
    res.status(HttpStatus.OK).json(parcs);
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// get a single parc
const getParc = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const parc = await prisma.parc.findFirst({
      include: { Typeparc: true },
      where: { id },
    });

    if (!parc) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    res.status(HttpStatus.OK).json(parc);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// create new parc
const createParc = async (req, res) => {
  // return res.status(HttpStatus.CREATED).json(req.body)
  try {
    const { name, typeparcId } = req.body;

    let emptyFields = [];

    if (!name) emptyFields.push("name");
    if (!typeparcId) emptyFields.push("typeparcId");

    if (emptyFields.length > 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Veuillez remplir tout les champs!", emptyFields });
    }

    const exists = await prisma.parc.findFirst({
      where: { name },
    });

    if (exists) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Parc déjà utilisé" });
    }

    const parc = await prisma.parc.create({
      data: { name, typeparcId: typeparcId },
    });
    res.status(HttpStatus.CREATED).json(parc);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// delete a parc
const deleteParc = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const parc = await prisma.parc.findFirst({
      where: { id },
    });
    if (!parc) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    await prisma.parc.delete({
      where: { id },
    });

    res.status(HttpStatus.OK).json(parc);
  } catch (error) {
    console.warn(error);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// update a parc
const updateParc = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, typeparcId } = req.body;

    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const parc = await prisma.parc.findFirst({
      where: { id },
    });

    // check if name not already exist
    const nameExist = await prisma.parc.findFirst({
      where: { name, id: { not: id } },
    });
    if (nameExist) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error: "Nom déjà utilisé!" });
    }

    if (!parc) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const updatedWorkout = await prisma.parc.update({
      where: { id },
      data: { name, typeparcId: typeparcId },
    });

    res.status(HttpStatus.OK).json(updatedWorkout);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = {
  createParc,
  getParcs,
  getParc,
  deleteParc,
  updateParc,
  getParcsByTypeparc,
};
