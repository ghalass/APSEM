#!/bin/bash

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Déploiement APSEM sur VPS ===${NC}"

# 1. Vérifier et générer package-lock.json si nécessaire
echo -e "${YELLOW}[1/8] Vérification des fichiers de dépendances...${NC}"

# Pour le client
if [ ! -f "client/package-lock.json" ]; then
    echo -e "${YELLOW}  → Génération package-lock.json pour le client...${NC}"
    cd client
    rm -rf node_modules
    npm install
    cd ..
fi

# Pour le server
if [ ! -f "server/package-lock.json" ]; then
    echo -e "${YELLOW}  → Génération package-lock.json pour le serveur...${NC}"
    cd server
    rm -rf node_modules
    npm install --omit=dev
    cd ..
fi

# 2. Arrêter les conteneurs existants
echo -e "${YELLOW}[2/8] Arrêt des conteneurs existants...${NC}"
docker-compose down

# 3. Nettoyer les anciennes images
echo -e "${YELLOW}[3/8] Nettoyage des anciennes images...${NC}"
docker system prune -af

# 4. Builder les images
echo -e "${YELLOW}[4/8] Construction des images Docker...${NC}"
docker-compose build --no-cache

# 5. Démarrer les conteneurs
echo -e "${YELLOW}[5/8] Démarrage des conteneurs...${NC}"
docker-compose up -d

# 6. Attendre que les services soient prêts
echo -e "${YELLOW}[6/8] Attente du démarrage des services...${NC}"
sleep 20

# 7. Vérifier le statut
echo -e "${YELLOW}[7/8] Vérification du déploiement...${NC}"
docker-compose ps

# 8. Vérification rapide
echo -e "${YELLOW}[8/8] Tests de fonctionnement...${NC}"
echo -n "Backend: "
if curl -s -f http://localhost:4000 > /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

echo -n "Frontend: "
if curl -s -f http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

echo -e "${GREEN}=== Déploiement terminé ! ===${NC}"
echo -e "Frontend: ${GREEN}http://147.79.118.72:3000${NC}"
echo -e "Backend API: ${GREEN}http://147.79.118.72:4000${NC}"
echo -e "Base de données: ${GREEN}147.79.118.72:5432${NC}"