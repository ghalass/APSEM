FROM node:22-alpine

WORKDIR /app

# Installer les dépendances système pour Prisma
RUN apk add --no-cache openssl

# Copier package.json
COPY package*.json ./

# Copier le schéma Prisma
COPY prisma ./prisma/

# Installer les dépendances (utiliser npm install au lieu de npm ci)
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