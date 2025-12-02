require("dotenv").config();
const prisma = require("../config/prismaClient");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { tokenExpireIn } = require("../helpers/constantes");
const HttpStatus = require("../helpers/httpStatus");

const generateToken = (loggedUser) => {
  return jwt.sign(loggedUser, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: `${tokenExpireIn}h`,
  });
};

// signup user
const signupUser = async (req, res) => {
  const { name, email, password, roles } = req.body;

  try {
    // validation
    if (!name || !email || !password) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Veuillez remplir tout les champs!" });
    }
    if (!validator.isEmail(email)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "E-mail invalide!" });
    }
    if (!validator.isLength(password, { min: 6 })) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Password doit être au minimum de 6 caractères!" });
    }

    const exists = await prisma.user.findFirst({
      where: { email: email },
    });

    if (exists) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "E-mail déjà utilisé." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // PRÉPARER LES DONNÉES DE CRÉATION
    let rolesToConnect = [];

    // SI DES RÔLES SONT FOURNIS DANS LA REQUÊTE
    if (roles && Array.isArray(roles) && roles.length > 0) {
      // VÉRIFIER QUE TOUS LES RÔLES EXISTENT
      const roleIds = roles.map((role) => role.id).filter((id) => id);

      if (roleIds.length > 0) {
        const existingRoles = await prisma.role.findMany({
          where: {
            id: { in: roleIds },
          },
        });

        // S'ASSURER QUE TOUS LES RÔLES DEMANDÉS EXISTENT
        if (existingRoles.length === roleIds.length) {
          rolesToConnect = roleIds.map((id) => ({ id }));
        } else {
          return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ error: "Un ou plusieurs rôles n'existent pas" });
        }
      }
    } else {
      // RÔLE PAR DÉFAUT "User" SI AUCUN RÔLE N'EST FOURNI
      const defaultRole = await prisma.role.findFirst({
        where: { name: "User" },
      });

      let role;
      if (!defaultRole) {
        role = await prisma.role.create({
          data: { name: "User" },
        });
      } else {
        role = defaultRole;
      }
      rolesToConnect = [{ id: role.id }];
    }

    // CRÉATION DE L'UTILISATEUR
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        roles: {
          connect: rolesToConnect,
        },
      },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });

    // SELECT USER FIELDS TO SAVE IN TOKEN
    const createdUser = {
      userId: user?.id,
      name: user?.name,
      email: user?.email,
      roles: user?.roles,
    };

    // GENERATE TOKEN
    const token = generateToken(createdUser);

    // SEND USER AND TOKEN
    res.status(HttpStatus.OK).json({ user: createdUser, token });
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIELDS VALIDATION
    if (!email || !password) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Veuillez remplir tout les champs!" });
    }
    if (!validator.isEmail(email)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "E-mail invalide!" });
    }

    // FIND THE USER
    const user = await prisma.user.findFirst({
      where: { email: email },
      include: { roles: true },
    });

    // CHECK IF USER EXIST
    if (!user) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "E-mail Or Password incorrect." });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "E-mail Or Password incorrect." });
    }

    // CHECK IF ACCOUNT IS ACTIVE
    if (!user?.active)
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: "Votre compte est désactivé, veuillez contacter un admin.",
      });

    // SELECT USER FIELDS TO SAVE IN TOKEN
    const loggedUser = {
      userId: user?.id,
      name: user?.name,
      email: user?.email,
      roles: user?.roles,
    };
    // GENERATE TOKEN
    const token = generateToken(loggedUser);

    // res.cookie("jwt", token, {
    //   httpOnly: true, //accessible only by web server
    //   secure: true, //https
    //   sameSite: "None", //cross-site cookie
    //   maxAge: tokenExpireIn * 60 * 60 * 1000, // tokenExpireIn * 60 * 60 * 1000 ==> hours
    // });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false, // ← false pour HTTP
      sameSite: "Lax", // ← 'Lax' pour HTTP
      maxAge: tokenExpireIn * 60 * 60 * 1000,
    });

    // SEND USER AND TOKEN
    res.status(HttpStatus.OK).json({ user: loggedUser, token });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// login user
const logoutUser = async (req, res) => {
  try {
    const cookies = req.cookies;
    res.clearCookie("jwt");
    res.status(HttpStatus.OK).json(cookies);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// signup user
const changePassword = async (req, res) => {
  const { oldPassword, newPassword, email } = req.body;

  try {
    // validation inputs
    if (!oldPassword || !newPassword || !email) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Veuillez remplir tout les champs!" });
    }
    if (!validator.isLength(newPassword, { min: 6 })) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Password doit être au minimum de 6 caractères!" });
    }
    // find the user
    const exists = await prisma.user.findFirst({
      where: { email: email },
    });

    // check is user email exist
    if (!exists) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "E-mail n'existe pas!" });
    }

    // check if actual password is correct
    const match = await bcrypt.compare(oldPassword, exists.password);
    if (!match) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Password actuel est incorrect." });
    }

    // check if email is his email
    // user can change only his password
    // verify authentication
    const { authorization } = req.headers;
    if (!authorization) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error: "Authorization token required!" });
    }
    const token = authorization.split(" ")[1];
    const { id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (exists.id !== id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: "Vous pouvez changer uniquement votre propre mot de passe!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { password: hash },
      omit: { password: true },
    });

    res.status(HttpStatus.OK).json(updatedUser);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// get all users
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: [{ id: "desc" }, { name: "asc" }, { active: "desc" }],
      omit: { password: true },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });
    return res.status(HttpStatus.OK).json(users);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// update a user
const updateUser = async (req, res) => {
  try {
    const { id } = req.body;

    // CHECK IF USER ID IS PROVIDED
    if (!id) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "YOU MUST PROVIDE THE USER ID" });
    }

    // FIND & CHECK IF USER TO UPDATE EXISTS
    const selectedUSER = await prisma.user.findFirst({
      where: { id: id },
    });
    if (!selectedUSER) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: "USER NOT FOUND" });
    }

    // CHECK IF EMAIL IS NOT ALREADY USED BY ANOTHER USER
    if (req.body?.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: req.body.email,
          id: { not: id },
        },
      });
      if (existingUser) {
        return res
          .status(HttpStatus.CONFLICT)
          .json({ error: "CET EMAIL EST DÉJÀ UTILISÉ!" });
      }
    }

    // PRÉPARER LES DONNÉES DE MISE À JOUR
    const updateData = { ...req.body };

    // Supprimer l'id des données de mise à jour
    delete updateData.id;

    // Gérer le mot de passe
    if (updateData.password && updateData.password !== "") {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(updateData.password, salt);
      updateData.password = hash;
    } else {
      delete updateData.password;
    }

    // Supprimer les rôles des données de mise à jour
    const { roles, ...bodyWithoutRoles } = updateData;

    // GESTION DES RÔLES
    if (roles && Array.isArray(roles)) {
      try {
        // Utiliser une transaction pour garantir l'intégrité des données
        await prisma.$transaction(async (tx) => {
          // 1. DÉSASSOCIER TOUS LES RÔLES EXISTANTS
          await tx.user.update({
            where: { id: id },
            data: {
              roles: {
                set: [], // Déconnecte tous les rôles existants
              },
            },
          });

          // 2. ASSOCIER LES NOUVEAUX RÔLES
          if (roles.length > 0) {
            // Extraire les IDs des rôles
            const roleIds = roles.map((role) => role.id).filter((id) => id);

            if (roleIds.length > 0) {
              await tx.user.update({
                where: { id: id },
                data: {
                  roles: {
                    connect: roleIds.map((id) => ({ id })),
                  },
                },
              });
            }
          }
        });
      } catch (roleError) {
        console.error("Error managing roles:", roleError);
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: "Erreur lors de la mise à jour des rôles" });
      }
    }

    // UPDATE THE USER (les autres données)
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: bodyWithoutRoles,
      omit: { password: true },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });

    res.status(HttpStatus.OK).json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

const checkToken = async (req, res, next) => {
  const cookies = req.cookies;

  // FETCH TOKEN FROM COOKIE
  const jwtCookie = cookies?.jwt;

  // CHECK IF TOKEN EXIST
  if (!jwtCookie)
    return res.status(HttpStatus.UNAUTHORIZED).json({ error: "UNAUTHORIZED" });

  // VERIFY TOKEN
  jwt.verify(
    jwtCookie,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err)
        return res.status(HttpStatus.FORBIDDEN).json({ error: "FORBIDDEN" });

      // CHECK IF USER EXIST IN DATABASE
      const foundedUser = await prisma.user.findFirst({
        where: { id: decoded?.userId },
        include: { roles: { include: { permissions: true } } },
      });
      if (!foundedUser)
        res.status(HttpStatus.UNAUTHORIZED).json({ error: "UNAUTHORIZED" });

      // SELECT USER FIELDS TO SAVE IN TOKEN
      const loggedUser = {
        id: foundedUser?.id,
        name: foundedUser?.name,
        email: foundedUser?.email,
        roles: foundedUser?.roles,
      };

      // SEND USER AND TOKEN
      res.status(HttpStatus.OK).json({ user: loggedUser, jwt: jwtCookie });
    }
  );
};

// delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    if (isNaN(id) || id != id) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'est pas trouvé!" });
    }

    const user = await prisma.user.findFirst({
      where: { id: id },
    });

    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Enregistrement n'existe pas!" });
    }

    await prisma.user.delete({
      where: { id: id },
    });

    res.status(HttpStatus.OK).json(user);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// createSuperAdmin
const createSuperAdmin = async (req, res, next) => {
  try {
    const name = "ghalass";
    const email = "ghalass@gmail.com";
    const password = "gh@l@ss@dmin";
    // const role = "SUPER_ADMIN";

    // CHECK IF USER EXIST IN DATABASE
    const exists = await prisma.user.findFirst({ where: { email: email } });
    // IF EXIST RETURN
    if (exists)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json("SUPER_ADMIN ALREADY CREATED");
    // IF NOT EXIST RETURN => CREATE HIM
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const defaultRole = await prisma.role.findFirst({
      where: { name: "Super Admin" },
    });
    let role;
    if (!defaultRole) {
      role = await prisma.role.create({
        data: { name: "Super Admin" },
      });
    } else {
      role = defaultRole;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        roles: {
          connect: {
            id: role.id,
          },
        },
      },
    });

    // CONFIRMATION
    return res.status(HttpStatus.OK).json("SUPER_ADMIN CREATED SUCCESSFULLY");
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  signupUser,
  changePassword,
  getUsers,
  updateUser,
  deleteUser,
  logoutUser,
  checkToken,
  createSuperAdmin,
};
