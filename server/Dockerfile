FROM node:22-bookworm-slim

WORKDIR /app

# 1. Activer pnpm via corepack (méthode recommandée)
RUN corepack enable pnpm

# 2. Installer les dépendances système pour Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# 3. Copier les fichiers de configuration
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# 4. Installer les dépendances avec pnpm
RUN pnpm install --frozen-lockfile

# 5. Générer le client Prisma
RUN pnpm exec prisma generate

# 6. Vérification
RUN echo "=== VÉRIFICATION PNPM ===" && \
    echo "1. pnpm version:" && \
    pnpm --version && \
    echo "2. Structure node_modules:" && \
    ls -la node_modules/.pnpm/ 2>/dev/null || echo "Pas de .pnpm" && \
    echo "3. Engines Prisma:" && \
    find /app -name "*.node" -type f | grep -i prisma | head -5 || echo "Engines non trouvés"

COPY . .

EXPOSE 4000

# Utiliser pnpm pour démarrer
CMD ["pnpm", "exec", "node", "server.js"]