# Connection au VPS

ssh root@147.79.118.72
Gh@l@s2025-1986

# Aller vers www folder

cd /var/www

# Cloner le projet

git clone https://github.com/ghalass/APSEM.git

cd APSEM

# Donner les permissions au script

chmod +x deploy.sh

# Exécuter le déploiement

./deploy.sh

# Voir les logs

docker-compose logs -f

# Vérifier les conteneurs

docker-compose ps

# Tester l'API

curl http://localhost:4000/api/health

# Installer Certbot

sudo apt install certbot python3-certbot-nginx -y

# Obtenir un certificat

sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Configurer le renouvellement automatique

sudo certbot renew --dry-run
