const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");
// get all
const getTypeconsommationlubs = async (req, res) => {
  try {
    // First get all Typeconsommationlub with their related Parcs
    const typeconsommationlubs = await prisma.typeconsommationlub.findMany({
      include: {
        parcs: {
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
    res.status(HttpStatus.OK).json(typeconsommationlubs);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// get a single typepanne
const getTypeconsommationlub = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const typeconsommationlub = await prisma.typeconsommationlub.findFirst({
      where: { id },
    });

    if (!typeconsommationlub) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    res.status(HttpStatus.OK).json(typeconsommationlub);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// create new typepanne
const createTypeconsommationlub = async (req, res) => {
  const { name } = req.body;

  let emptyFields = [];

  if (!name) emptyFields.push("name");

  if (emptyFields.length > 0) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "Veuillez remplir tout les champs!", emptyFields });
  }

  try {
    const exists = await prisma.typeconsommationlub.findFirst({
      where: { name: name },
    });

    if (exists) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Nom déjà utilisé" });
    }

    const updated = await prisma.typeconsommationlub.create({
      data: { name },
    });
    res.status(HttpStatus.CREATED).json(updated);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// delete a typepanne
const deleteTypeconsommationlub = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const typeconsommationlub = await prisma.typeconsommationlub.findFirst({
      where: { id },
    });

    if (!typeconsommationlub) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    // check if typeconsommationlub has typeconsommationlub_parc
    const typeconsommationlub_parc =
      await prisma.typeconsommationlubParc.findFirst({
        where: { typeconsommationlubId },
      });
    if (typeconsommationlub_parc) {
      return res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
        error:
          "Impossible de supprimer cet élément car il est référencé ailleurs.",
      });
    }

    await prisma.typeconsommationlub.delete({
      where: { id },
    });

    res.status(HttpStatus.OK).json(typeconsommationlub_parc);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// update a typepanne
const updateTypeconsommationlub = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    if (!id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const typeconsommationlub = await prisma.typeconsommationlub.findFirst({
      where: { id },
    });

    // check if name not already exist
    const nameExist = await prisma.typeconsommationlub.findFirst({
      where: { name: name, id: { not: id } },
    });
    if (nameExist) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Nom déjà utilisé!" });
    }

    if (!typeconsommationlub) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    const updated = await prisma.typeconsommationlub.update({
      where: { id },
      data: { name },
    });

    res.status(HttpStatus.OK).json(updated);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// create new typepanne
const addParcToCodeTypeconsommationlub = async (req, res) => {
  const { parc_id, typeconsommationlub_id } = req.body;
  let emptyFields = [];

  if (!parc_id) emptyFields.push("Parc Id");
  if (!typeconsommationlub_id) emptyFields.push("Typeconsommationlub Id");

  if (emptyFields.length > 0) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "Veuillez remplir tout les champs!", emptyFields });
  }

  try {
    // Check if the relationship already exists
    const existingRelation = await prisma.typeconsommationlubParc.findUnique({
      where: {
        parcId_typeconsommationlubId: {
          parcId: parc_id,
          typeconsommationlubId: typeconsommationlub_id,
        },
      },
    });

    if (existingRelation) {
      return res.status(HttpStatus.CONFLICT).json({
        error: "Ce code est déjà affcté à ce parc.",
      });
    }

    // Create new relationship - CORRECTED VERSION
    const updated = await prisma.typeconsommationlubParc.create({
      data: {
        parc: { connect: { id: parc_id } },
        typeconsommationlub: {
          connect: { id: typeconsommationlub_id },
        },
      },
      include: {
        parc: true,
        typeconsommationlub: true,
      },
    });

    res.status(HttpStatus.CREATED).json(updated);
  } catch (error) {
    // Improved error handling
    if (error.code === "P2025") {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: "Parc ou Typeconsommationlub introuvable. Vérifiez les IDs.",
      });
    }
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

const deleteAffectationCodeToParc = async (req, res) => {
  const { parc_id, typeconsommationlub_id } = req.body;
  let emptyFields = [];

  if (!parc_id) emptyFields.push("Parc Id");
  if (!typeconsommationlub_id) emptyFields.push("Typeconsommationlub Id");

  if (emptyFields.length > 0) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "Veuillez remplir tout les champs!", emptyFields });
  }

  try {
    // Check if record exists (using composite key format)
    const typeconsommationlub_parc =
      await prisma.typeconsommationlubParc.findUnique({
        where: {
          parcId_typeconsommationlubId: {
            parcId: parc_id,
            typeconsommationlubId: typeconsommationlub_id,
          },
        },
      });

    if (!typeconsommationlub_parc) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    // Delete using composite key format
    await prisma.typeconsommationlubParc.delete({
      where: {
        parcId_typeconsommationlubId: {
          parcId: parc_id,
          typeconsommationlubId: typeconsommationlub_id,
        },
      },
    });

    res.status(HttpStatus.OK).json(typeconsommationlub_parc);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getAllTypeconsommationlubsByParcId = async (req, res) => {
  try {
    const { id } = req.params;

    const typeconsommationlubs = await prisma.typeconsommationlub.findMany({
      where: {
        parcs: {
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

    res.status(HttpStatus.OK).json(typeconsommationlubs);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

module.exports = {
  createTypeconsommationlub,
  getTypeconsommationlub,
  getTypeconsommationlubs,
  deleteTypeconsommationlub,
  updateTypeconsommationlub,
  addParcToCodeTypeconsommationlub,
  deleteAffectationCodeToParc,
  getAllTypeconsommationlubsByParcId,
};
