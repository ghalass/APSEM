const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");
// get all
const getResources = async (req, res) => {
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name NOT IN ('role', 'permission')
      ORDER BY table_name ASC
    `;

    // Filtrer les tables qui ne commencent pas par "prisma_" ou "_"
    const filteredTables = tables
      .map((table) => table.table_name + "s")
      .filter(
        (tableName) =>
          !tableName.startsWith("prisma_") && !tableName.startsWith("_")
      );

    // console.log(filteredTables);

    res.status(HttpStatus.OK).json(filteredTables);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// get a single site
const getResource = async (req, res) => {
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
const createResource = async (req, res) => {
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
        .json({ error: "Resource déjà utilisé" });
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
const deleteResource = async (req, res) => {
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
const updateResource = async (req, res) => {
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
  createResource,
  getResources,
  getResource,
  deleteResource,
  updateResource,
};
