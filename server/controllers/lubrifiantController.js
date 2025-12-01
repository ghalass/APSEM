const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");
// get all
const getLubrifiants = async (req, res) => {
  try {
    const lubrifiants = await prisma.lubrifiant.findMany({
      orderBy: { name: "asc" },
      include: {
        Typelubrifiant: {
          select: {
            id: true,
            name: true,
          },
        },
        LubrifiantParc: {
          include: {
            parc: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Transformation des données
    const formattedLubrifiants = lubrifiants.map((lub) => ({
      id: lub.id,
      name: lub.name,
      typelubrifiant: lub.Typelubrifiant,
      parcs: lub.LubrifiantParc.map((lp) => lp.parc),
    }));

    res.status(HttpStatus.OK).json(formattedLubrifiants);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error fetching lubrifiants",
      details: error.message,
    });
  }
};

// get a single lubrifiant
const getLubrifiant = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const lubrifiant = await prisma.lubrifiant.findFirst({
      where: { id },
    });

    if (!lubrifiant) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    res.status(HttpStatus.OK).json(lubrifiant);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// create new lubrifiant
const createLubrifiant = async (req, res) => {
  try {
    const { name, typelubrifiantId } = req.body;

    let emptyFields = [];

    if (!name) emptyFields.push("name");
    if (!typelubrifiantId) emptyFields.push("typelubrifiantId");

    if (emptyFields.length > 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Veuillez remplir tout les champs!", emptyFields });
    }
    const exists = await prisma.lubrifiant.findFirst({
      where: { name },
    });

    if (exists) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "lubrifiant déjà utilisé" });
    }

    const lubrifiant = await prisma.lubrifiant.create({
      data: { name, typelubrifiantId: typelubrifiantId },
    });
    res.status(HttpStatus.CREATED).json(lubrifiant);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// delete a lubrifiant
const deleteLubrifiant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const lubrifiant = await prisma.lubrifiant.findFirst({
      where: { id },
    });

    if (!lubrifiant) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    await prisma.lubrifiant.delete({
      where: { id },
    });

    res.status(HttpStatus.OK).json(lubrifiant);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// update a lubrifiant
const updateLubrifiant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, typelubrifiantId } = req.body;

    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const lubrifiant = await prisma.lubrifiant.findFirst({
      where: { id },
    });

    // check if name not already exist
    const nameExist = await prisma.lubrifiant.findFirst({
      where: { name: name, id: { not: id } },
    });
    if (nameExist) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Nom déjà utilisé!" });
    }

    if (!lubrifiant) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const updatedWorkout = await prisma.lubrifiant.update({
      where: { id },
      data: { name, typelubrifiantId: typelubrifiantId },
    });

    res.status(HttpStatus.OK).json(updatedWorkout);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

const addParcToLubrifiant = async (req, res) => {
  const { parc_id, lubrifiant_id } = req.body;
  console.log(parc_id, lubrifiant_id);

  let emptyFields = [];

  if (!parc_id) emptyFields.push("Parc Id");
  if (!lubrifiant_id) emptyFields.push("lubrifiant Id");

  if (emptyFields.length > 0) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "Veuillez remplir tout les champs!", emptyFields });
  }

  try {
    // Check if the relationship already exists
    const existingRelation = await prisma.lubrifiantParc.findUnique({
      where: {
        parcId_lubrifiantId: {
          parcId: parc_id,
          lubrifiantId: lubrifiant_id,
        },
      },
    });

    if (existingRelation) {
      return res.status(HttpStatus.CONFLICT).json({
        error: "Ce Type panne est déjà affcté à ce parc.",
      });
    }

    // Create new relationship - CORRECTED VERSION
    const updated = await prisma.lubrifiantParc.create({
      data: {
        parc: { connect: { id: parc_id } },
        lubrifiant: { connect: { id: lubrifiant_id } },
      },
      include: {
        parc: true,
        lubrifiant: true,
      },
    });

    res.status(HttpStatus.CREATED).json(updated);
  } catch (error) {
    // Improved error handling
    if (error.code === "P2025") {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: "Parc ou lubrifiant introuvable. Vérifiez les IDs.",
      });
    }
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

const deleteAffectationLubrifiant = async (req, res) => {
  const { parc_id, lubrifiant_id } = req.body;
  let emptyFields = [];

  if (!parc_id) emptyFields.push("Parc Id");
  if (!lubrifiant_id) emptyFields.push("lubrifiant Id");

  if (emptyFields.length > 0) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "Veuillez remplir tout les champs!", emptyFields });
  }

  try {
    // Check if record exists (using composite key format)
    const lubrifiant_parc = await prisma.lubrifiantParc.findUnique({
      where: {
        parcId_lubrifiantId: {
          parcId: parc_id,
          lubrifiantId: lubrifiant_id,
        },
      },
    });

    if (!lubrifiant_parc) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    // Delete using composite key format
    await prisma.lubrifiantParc.delete({
      where: {
        parcId_lubrifiantId: {
          parcId: parc_id,
          lubrifiantId: lubrifiant_id,
        },
      },
    });

    res.status(HttpStatus.OK).json(lubrifiant_parc);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getAllLubrifiantsByParcId = async (req, res) => {
  try {
    const { id } = req.params;

    const lubrifiants = await prisma.lubrifiant.findMany({
      where: {
        LubrifiantParc: {
          some: {
            parcId: id,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    res.status(HttpStatus.OK).json(lubrifiants);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

module.exports = {
  createLubrifiant,
  getLubrifiants,
  getLubrifiant,
  deleteLubrifiant,
  updateLubrifiant,
  addParcToLubrifiant,
  deleteAffectationLubrifiant,
  getAllLubrifiantsByParcId,
};
