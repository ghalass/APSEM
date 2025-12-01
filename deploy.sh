#!/bin/bash

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Déploiement APSEM FINAL ===${NC}"

# 1. Vérifier et libérer le port 5432
echo -e "${YELLOW}[1/8] Vérification des ports...${NC}"
if sudo lsof -i:5432 > /dev/null 2>&1; then
    echo -e "${YELLOW}  → Port 5432 utilisé, libération...${NC}"
    sudo systemctl stop postgresql 2>/dev/null || true
    sudo kill -9 $(sudo lsof -t -i:5432) 2>/dev/null || true
    docker stop $(docker ps -q --filter "publish=5432") 2>/dev/null || true
    sleep 2
fi

# 2. Arrêter les conteneurs existants
echo -e "${YELLOW}[2/8] Arrêt des conteneurs APSEM...${NC}"
docker-compose down

# 3. Nettoyer
echo -e "${YELLOW}[3/8] Nettoyage...${NC}"
docker system prune -af
docker volume prune -f

# 4. Vérifier la configuration
echo -e "${YELLOW}[4/8] Vérification de la configuration...${NC}"
echo "  PostgreSQL port: 5433 (externe) / 5432 (interne)"
echo "  Backend port: 4000"
echo "  Frontend port: 3000"

# 5. Builder les images
echo -e "${YELLOW}[5/8] Construction des images...${NC}"
docker-compose build --no-cache

# 6. Démarrer
echo -e "${YELLOW}[6/8] Démarrage des services...${NC}"
docker-compose up -d

# 7. Attendre
echo -e "${YELLOW}[7/8] Attente du démarrage...${NC}"
sleep 25

# 8. Vérification
echo -e "${YELLOW}[8/8] Vérification finale...${NC}"

echo ""
echo -e "${GREEN}=== STATUT DES SERVICES ===${NC}"

# Vérifier PostgreSQL
echo -n "PostgreSQL (port 5433): "
if docker-compose exec postgres pg_isready -U apsem_user > /dev/null 2>&1; then
    echo -e "${GREEN}✓ EN LIGNE${NC}"
else
    echo -e "${RED}✗ HORS LIGNE${NC}"
    echo -e "${YELLOW}Logs PostgreSQL:${NC}"
    docker-compose logs postgres --tail=10
fi

# Vérifier Backend
echo -n "Backend API (port 4000): "
if curl -s -f http://localhost:4000 > /dev/null; then
    echo -e "${GREEN}✓ EN LIGNE${NC}"
else
    echo -e "${RED}✗ HORS LIGNE${NC}"
    echo -e "${YELLOW}Logs Backend:${NC}"
    docker-compose logs backend --tail=10
fi

# Vérifier Frontend
echo -n "Frontend (port 3000): "
if curl -s -f http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ EN LIGNE${NC}"
else
    echo -e "${RED}✗ HORS LIGNE${NC}"
    echo -e "${YELLOW}Logs Frontend:${NC}"
    docker-compose logs frontend --tail=10
fi

echo ""
echo -e "${GREEN}=== DÉPLOIEMENT TERMINÉ ===${NC}"
echo ""
echo -e "${YELLOW}URLs d'accès:${NC}"
echo -e "  Frontend:    ${GREEN}http://147.79.118.72:3000${NC}"
echo -e "  Backend API: ${GREEN}http://147.79.118.72:4000${NC}"
echo -e "  PostgreSQL:  ${GREEN}147.79.118.72:5433${NC} (user: apsem_user)"
echo ""
echo -e "${YELLOW}Commandes utiles:${NC}"
echo -e "  Voir tous les logs: ${GREEN}docker-compose logs -f${NC}"
echo -e "  Voir le statut:     ${GREEN}docker-compose ps${NC}"
echo -e "  Redémarrer:         ${GREEN}docker-compose restart${NC}"
echo -e "  Arrêter:            ${GREEN}docker-compose down${NC}"