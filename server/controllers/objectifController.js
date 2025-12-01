const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");
// get all
const getObjectifs = async (req, res) => {
  try {
    const objectifs = await prisma.objectif.findMany({
      include: { Parc: true, Site: true },
      orderBy: { annee: "asc" },
    });
    res.status(HttpStatus.OK).json(objectifs);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// get a single objectif
const getObjectif = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const objectif = await prisma.objectif.findFirst({
      where: { id },
    });

    if (!objectif) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    res.status(HttpStatus.OK).json(objectif);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// create new objectif
const createObjectif = async (req, res) => {
  const {
    annee,
    parcId,
    siteId,
    dispo,
    mtbf,
    tdm,
    spe_huile,
    spe_go,
    spe_graisse,
  } = req.body;
  let emptyFields = [];

  if (!annee) emptyFields.push("annee");
  if (!parcId) emptyFields.push("parcId");
  if (!siteId) emptyFields.push("siteId");

  if (emptyFields.length > 0) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "Veuillez remplir tout les champs!", emptyFields });
  }

  try {
    const exists = await prisma.objectif.findFirst({
      where: {
        annee: parseInt(annee),
        parcId: parcId,
        siteId: siteId,
      },
    });

    if (exists) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "objectif déjà utilisé" });
    }

    const objectif = await prisma.objectif.create({
      data: {
        annee: parseInt(annee),
        parcId: parcId,
        siteId: siteId,
        dispo: parseFloat(dispo),
        mtbf: parseFloat(mtbf),
        tdm: parseFloat(tdm),
        spe_huile: parseFloat(spe_huile),
        spe_go: parseFloat(spe_go),
        spe_graisse: parseFloat(spe_graisse),
      },
    });
    res.status(HttpStatus.CREATED).json(objectif);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// delete a objectif
const deleteObjectif = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const objectif = await prisma.objectif.findFirst({
      where: { id },
    });

    if (!objectif) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    await prisma.objectif.delete({
      where: { id },
    });

    res.status(HttpStatus.OK).json(objectif);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// update a objectif
const updateObjectif = async (req, res) => {
  const { id } = req.params;
  const {
    annee,
    parcId,
    siteId,
    dispo,
    mtbf,
    tdm,
    spe_huile,
    spe_go,
    spe_graisse,
  } = req.body;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const objectif = await prisma.objectif.findFirst({
      where: { id },
    });

    // check if name not already exist
    const nameExist = await prisma.objectif.findFirst({
      where: {
        id: { not: id },
        annee: parseInt(annee),
        parcId: parcId,
        siteId: siteId,
      },
    });
    if (nameExist) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Nom déjà utilisé!" });
    }

    if (!objectif) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const updatedWorkout = await prisma.objectif.update({
      where: { id },
      data: {
        annee: parseInt(),
        parcId: parcId,
        siteId: siteId,
        dispo: parseFloat(dispo),
        mtbf: parseFloat(mtbf),
        tdm: parseFloat(tdm),
        spe_huile: parseFloat(spe_huile),
        spe_go: parseFloat(spe_go),
        spe_graisse: parseFloat(spe_graisse),
      },
    });

    res.status(HttpStatus.OK).json(updatedWorkout);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = {
  createObjectif,
  getObjectifs,
  getObjectif,
  deleteObjectif,
  updateObjectif,
};
