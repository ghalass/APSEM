const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");
// get all
const getTypepannes = async (req, res) => {
  try {
    const typepannes = await prisma.typepanne.findMany({
      orderBy: { name: "asc" },
      include: {
        TypepanneParc: {
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

    // Transform the data to a cleaner structure
    const formattedTypepannes = typepannes.map((typepanne) => ({
      id: typepanne.id,
      name: typepanne.name,
      parcs: typepanne.TypepanneParc.map((tp) => tp.parc),
    }));

    res.status(HttpStatus.OK).json(formattedTypepannes);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error fetching typepannes",
      details: error.message,
    });
  }
};

// get a single typepanne
const getTypepanne = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const typepanne = await prisma.typepanne.findFirst({
      where: { id },
    });

    if (!typepanne) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    res.status(HttpStatus.OK).json(typepanne);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// create new typepanne
const createTypepanne = async (req, res) => {
  const { name } = req.body;

  let emptyFields = [];

  if (!name) emptyFields.push("name");

  if (emptyFields.length > 0) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "Veuillez remplir tout les champs!", emptyFields });
  }

  try {
    const exists = await prisma.typepanne.findFirst({
      where: { name: name },
    });

    if (exists) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Typepanne déjà utilisé" });
    }

    const typepanne = await prisma.typepanne.create({
      data: { name },
    });
    res.status(HttpStatus.CREATED).json(typepanne);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// delete a typepanne
const deleteTypepanne = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const typepanne = await prisma.typepanne.findFirst({
      where: { id },
    });

    if (!typepanne) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    // check if typepanne has pannes
    const panne = await prisma.panne.findFirst({
      where: { typepanneId },
    });
    if (panne) {
      return res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
        error:
          "Impossible de supprimer cet élément car il est référencé ailleurs.",
      });
    }

    await prisma.typepanne.delete({
      where: { id },
    });

    res.status(HttpStatus.OK).json(typepanne);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// update a typepanne
const updateTypepanne = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const typepanne = await prisma.typepanne.findFirst({
      where: { id },
    });

    // check if name not already exist
    const nameExist = await prisma.typepanne.findFirst({
      where: { name: name, id: { not: id } },
    });
    if (nameExist) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Nom déjà utilisé!" });
    }

    if (!typepanne) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const updatedWorkout = await prisma.typepanne.update({
      where: { id },
      data: { name },
    });

    res.status(HttpStatus.OK).json(updatedWorkout);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

const addParcToTypepanne = async (req, res) => {
  const { parc_id, typepanne_id } = req.body;
  let emptyFields = [];

  if (!parc_id) emptyFields.push("Parc Id");
  if (!typepanne_id) emptyFields.push("Typepanne Id");

  if (emptyFields.length > 0) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "Veuillez remplir tout les champs!", emptyFields });
  }

  try {
    // Check if the relationship already exists
    const existingRelation = await prisma.typepanneParc.findUnique({
      where: {
        parcId_typepanneId: {
          parcId: parc_id,
          typepanneId: typepanne_id,
        },
      },
    });

    if (existingRelation) {
      return res.status(HttpStatus.CONFLICT).json({
        error: "Ce Type panne est déjà affcté à ce parc.",
      });
    }

    // Create new relationship - CORRECTED VERSION
    const updated = await prisma.typepanneParc.create({
      data: {
        parc: { connect: { id: parc_id } },
        typepanne: { connect: { id: typepanne_id } },
      },
      include: {
        parc: true,
        typepanne: true,
      },
    });

    res.status(HttpStatus.CREATED).json(updated);
  } catch (error) {
    // Improved error handling
    if (error.code === "P2025") {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: "Parc ou Typepanne introuvable. Vérifiez les IDs.",
      });
    }
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

const deleteAffectationTypepanne = async (req, res) => {
  const { parc_id, typepanne_id } = req.body;
  let emptyFields = [];

  if (!parc_id) emptyFields.push("Parc Id");
  if (!typepanne_id) emptyFields.push("Typepanne Id");

  if (emptyFields.length > 0) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "Veuillez remplir tout les champs!", emptyFields });
  }

  try {
    // Check if record exists (using composite key format)
    const typepanne_parc = await prisma.typepanneParc.findUnique({
      where: {
        parcId_typepanneId: {
          parcId: parc_id,
          typepanneId: typepanne_id,
        },
      },
    });

    if (!typepanne_parc) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    // Delete using composite key format
    await prisma.typepanneParc.delete({
      where: {
        parcId_typepanneId: {
          parcId: parc_id,
          typepanneId: typepanne_id,
        },
      },
    });

    res.status(HttpStatus.OK).json(typepanne_parc);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getAllTypepannesByParcId = async (req, res) => {
  try {
    const { id } = req.params;

    const typepannes = await prisma.typepanne.findMany({
      where: {
        TypepanneParc: {
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

    res.status(HttpStatus.OK).json(typepannes);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

module.exports = {
  createTypepanne,
  getTypepannes,
  getTypepanne,
  deleteTypepanne,
  updateTypepanne,

  addParcToTypepanne,
  deleteAffectationTypepanne,
  getAllTypepannesByParcId,
};
