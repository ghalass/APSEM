const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");
// get all
const getSites = async (req, res) => {
  try {
    const sites = await prisma.site.findMany({
      orderBy: { name: "asc" },
    });
    res.status(HttpStatus.OK).json(sites);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// get a single site
const getSite = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const site = await prisma.site.findFirst({
      where: { id },
    });

    if (!site) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    res.status(HttpStatus.OK).json(site);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// create new site
const createSite = async (req, res) => {
  const { name } = req.body;

  let emptyFields = [];

  if (!name) emptyFields.push("name");

  if (emptyFields.length > 0) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "Veuillez remplir tout les champs!", emptyFields });
  }

  try {
    const exists = await prisma.site.findFirst({
      where: { name: name },
    });

    if (exists) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Site déjà utilisé" });
    }

    const site = await prisma.site.create({
      data: { name },
    });
    res.status(HttpStatus.CREATED).json(site);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// delete a site
const deleteSite = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const site = await prisma.site.findFirst({
      where: { id },
    });

    if (!site) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    await prisma.site.delete({
      where: { id },
    });

    res.status(HttpStatus.OK).json(site);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// update a site
const updateSite = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const site = await prisma.site.findFirst({
      where: { id },
    });

    // check if name not already exist
    const nameExist = await prisma.site.findFirst({
      where: { name: name, id: { not: id } },
    });
    if (nameExist) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Nom déjà utilisé!" });
    }

    if (!site) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const updatedWorkout = await prisma.site.update({
      where: { id },
      data: { name },
    });

    res.status(HttpStatus.OK).json(updatedWorkout);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = {
  createSite,
  getSites,
  getSite,
  deleteSite,
  updateSite,
};
