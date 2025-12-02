# Connection au VPS

ssh root@147.79.118.72
Gh@l@s2025-1986

# Aller vers www folder

cd /var/www

# Cloner le projet

git clone https://github.com/ghalass/APSEM.git

cd APSEM

# Donner les permissions au script

chmod +x deploy.sh setup-ssl.sh

# Exécuter le déploiement

./deploy.sh

# Une fois les DNS configurés, ajouter SSL

./setup-ssl.sh

# Voir les logs

docker-compose logs -f

# Vérifier les conteneurs

docker-compose ps

# Vérifier les logs en temps réel

docker-compose logs -f backend

# Installer Certbot

sudo apt install certbot python3-certbot-nginx -y

# Obtenir un certificat

sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Configurer le renouvellement automatique

sudo certbot renew --dry-run

# Arrêter tout

docker-compose down

# Redémarrez les services Docker

docker-compose down
docker-compose up -d

# Supprimer volumes et images

docker system prune -af
docker volume prune -f

# Nettoyer le cache Docker => Sur Windows avec Docker Desktop

docker system prune -a --volumes

# Tester l'application complète

curl http://localhost:3000 # Frontend
curl http://localhost:4000 # Backend API

# Vérifier quel processus utilise le port 5433 Sur Windows (avec PowerShell ou CMD)

netstat -ano | findstr :5433

# OU avec Docker Desktop

docker ps -a | grep 5433

# lister les sites availables

ls /etc/nginx/sites-available/

# supprimer un site available

sudo rm /etc/nginx/sites-enabled/school.conf

# lister les sites enabled

ls /etc/nginx/sites-enabled/

# supprimer un site enabled

sudo rm /etc/nginx/sites-enabled/school.conf
