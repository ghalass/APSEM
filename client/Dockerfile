# Étape de build
FROM node:22-alpine AS builder

# Activer pnpm
RUN corepack enable pnpm

# Définir l'argument pour l'URL de l'API
ARG VITE_BASE_URL
ENV VITE_BASE_URL=${VITE_BASE_URL}

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installer les dépendances avec pnpm
RUN pnpm install --frozen-lockfile

# Copier les fichiers source
COPY . .

# Build l'application avec pnpm
RUN pnpm run build

# Étape d'exécution avec Nginx
FROM nginx:alpine

# Créer un répertoire spécifique pour votre application
RUN mkdir -p /var/www/apsem

# Copier les fichiers buildés dans le répertoire spécifique
COPY --from=builder /app/build /var/www/apsem

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Corriger les permissions
RUN chown -R nginx:nginx /var/www/apsem && \
    chmod -R 755 /var/www/apsem

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]