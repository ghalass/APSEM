#!/bin/bash

echo "=== Correction FINALE Prisma ==="
echo ""

echo "1. Arrêt des services..."
docker-compose down
echo ""

echo "2. Correction package.json..."
cd server

# Backup
cp package.json package.json.backup

# Package.json correct
cat > package.json << 'PKGEOF'
{
  "name": "backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "prisma": {
    "seed": "node config/seed.js"
  },
  "keywords": [],
  "author": "GHALASS",
  "license": "ISC",
  "type": "commonjs",
  "description": "",
  "dependencies": {
    "@faker-js/faker": "^9.7.0",
    "@prisma/client": "6.19.0",
    "bcryptjs": "^3.0.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.6.1",
    "express": "^4.21.2",
    "express-validator": "^7.3.1",
    "jsonwebtoken": "^9.0.2",
    "prisma": "6.19.0",
    "validator": "^13.12.0"
  },
  "engines": {
    "node": ">=22.12.0"
  }
}
PKGEOF

echo "3. Dockerfile corrigé..."
cat > Dockerfile << 'DOCKEREOF'
FROM node:22-alpine

WORKDIR /app

# Installer les dépendances système pour Prisma
RUN apk add --no-cache openssl

# Étape 1: Installer Prisma 6.19.0 en PREMIER
RUN npm init -y && npm install prisma@6.19.0

# Copier package.json
COPY package*.json ./

# Copier le schéma Prisma
COPY prisma ./prisma/

# Étape 2: Installer @prisma/client 6.19.0
RUN npm install @prisma/client@6.19.0

# Étape 3: Installer les autres dépendances
RUN npm install --omit=dev

# Générer le client Prisma
RUN npx prisma generate

# Copier le code source
COPY . .

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
DOCKEREOF

cd ..
echo "4. Nettoyage Docker..."
docker system prune -af
echo ""

echo "5. Reconstruction backend..."
docker-compose build --no-cache backend
echo ""

echo "6. Redémarrage..."
docker-compose up -d
echo ""

echo "7. Attente..."
sleep 25
echo ""

echo "8. Vérification..."
echo "8.1 Version Prisma:"
docker-compose exec backend npx prisma --version
echo ""
echo "8.2 Test API:"
curl -s http://localhost:4000 && echo "✓ Backend fonctionne" || echo "✗ Backend en erreur"
echo ""
echo "8.3 Logs backend:"
docker-compose logs backend --tail=10
echo ""
echo "8.4 Statut services:"
docker-compose ps
echo ""

echo "=== FIN ==="