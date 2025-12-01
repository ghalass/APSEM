const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");
// get all
const getEngins = async (req, res) => {
  try {
    const engins = await prisma.engin.findMany({
      include: { Parc: { include: { Typeparc: true } }, Site: true },
      orderBy: { name: "asc" },
    });

    res.status(HttpStatus.OK).json(engins);
  } catch (error) {
    console.error("Error fetching engins:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// get a single engin
const getEngin = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const engin = await prisma.engin.findFirst({
      include: { Parc: true, Site: true },
      where: { id },
    });

    if (!engin) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }
    res.status(HttpStatus.OK).json(engin);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// get a single engin by parcId
const getEnginByParcId = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const engin = await prisma.engin.findMany({
      where: { parcId },
    });

    if (!engin) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    res.status(HttpStatus.OK).json(engin);
  } catch (error) {
    console.log(error);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getEnginsByParcIdSiteId = async (req, res) => {
  try {
    const { parcId, siteId } = req.params;
    // return res.status(HttpStatus.OK).json(siteId)
    let emptyFields = [];

    if (!parcId) emptyFields.push("parcId");
    if (!siteId) emptyFields.push("siteId");

    if (emptyFields.length > 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Veuillez remplir tout les champs!", emptyFields });
    }

    const engin = await prisma.engin.findMany({
      where: { parcId: parcId, siteId: siteId },
    });

    // if (!engin) {
    //     return res.status(HttpStatus.NOT_FOUND).json({ error: "Enregistrement n'existe pas!" })
    // }

    res.status(HttpStatus.OK).json(engin);
  } catch (error) {
    console.log(error);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// create new engin
const createEngin = async (req, res) => {
  try {
    const { name, parcId, siteId, initialHeureChassis, active } = req.body;

    let emptyFields = [];

    if (!name) emptyFields.push("name");
    if (!parcId) emptyFields.push("parcId");
    if (!siteId) emptyFields.push("siteId");

    if (emptyFields.length > 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Veuillez remplir tout les champs!", emptyFields });
    }

    const exists = await prisma.engin.findFirst({
      where: { name },
    });

    if (exists) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Engin déjà utilisé" });
    }

    const engin = await prisma.engin.create({
      data: {
        name,
        parcId: parcId,
        siteId: siteId,
        initialHeureChassis: parseFloat(initialHeureChassis),
        active,
      },
    });
    res.status(HttpStatus.CREATED).json(engin);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// delete a engin
const deleteEngin = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const engin = await prisma.engin.findFirst({
      where: { id },
    });
    if (!engin) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    await prisma.engin.delete({
      where: { id },
    });

    res.status(HttpStatus.OK).json(engin);
  } catch (error) {
    console.warn(error);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// update a engin
const updateEngin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parcId, siteId, initialHeureChassis, active } = req.body;

    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    // check if name not already exist
    const nameExist = await prisma.engin.findFirst({
      where: { name, id: { not: id } },
    });
    if (nameExist) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Nom déjà utilisé!" });
    }

    const engin = await prisma.engin.findFirst({
      where: { id },
    });
    if (!engin) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const updatedWorkout = await prisma.engin.update({
      where: { id },
      data: {
        name,
        parcId: parcId,
        siteId: siteId,
        initialHeureChassis: parseFloat(initialHeureChassis),
        active,
      },
    });

    res.status(HttpStatus.OK).json(updatedWorkout);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = {
  createEngin,
  getEngins,
  getEngin,
  deleteEngin,
  updateEngin,
  getEnginByParcId,
  getEnginsByParcIdSiteId,
};
