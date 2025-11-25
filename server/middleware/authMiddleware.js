const prisma = require("../config/prismaClient");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    // Vérifier si le token est présent dans les cookies
    const tokenInCookie = req.cookies?.jwt;
    if (!tokenInCookie) {
      return res.status(401).json({ error: "AUTHORIZATION TOKEN REQUIRED!" });
    }

    // Vérifier la validité du token
    let userInToken;
    try {
      userInToken = jwt.verify(tokenInCookie, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      return res.status(401).json({ error: "INVALID TOKEN!" });
    }

    // Vérifier si l'ID utilisateur est valide
    if (!userInToken?.userId) {
      return res.status(401).json({ error: "INVALID USER ID IN TOKEN!" });
    }

    // Vérifier si l'utilisateur existe dans la base de données
    const checkedUser = await prisma.user.findUnique({
      where: { id: userInToken?.userId },
      select: { id: true, email: true }, // Sélectionner seulement les champs nécessaires
    });

    if (!checkedUser) {
      return res.status(401).json({ error: "USER NOT EXIST IN DATABASE!" });
    }

    // Ajouter l'utilisateur à la requête et continuer
    req.user = checkedUser;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR!" });
  }
};

module.exports = authMiddleware;
