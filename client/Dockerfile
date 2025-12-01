# Étape de build
FROM node:22-alpine AS builder

# Définir l'argument pour l'URL de l'API
ARG VITE_BASE_URL
ENV VITE_BASE_URL=${VITE_BASE_URL}

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances (utiliser npm install au lieu de npm ci)
RUN npm install

# Copier les fichiers source
COPY . .

# Build l'application
RUN npm run build

# Étape d'exécution avec Nginx
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=builder /app/build /usr/share/nginx/html

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]