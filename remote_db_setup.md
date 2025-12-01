# Configuration Base de Données PostgreSQL sur VPS Hostinger

## 🎯 Objectif
Créer un conteneur PostgreSQL sur le VPS Hostinger et s'y connecter depuis votre PC local.

## 📋 Étape 1: Créer le conteneur PostgreSQL sur le VPS

### Se connecter au VPS
```bash
ssh root@votre-ip-vps
```

### Créer un dossier pour le projet
```bash
mkdir -p /var/docker/apsem-db
cd /var/docker/apsem-db
```

### Créer le fichier docker-compose.yml
```bash
nano docker-compose.yml
```

Contenu du fichier:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: apsem-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: apsem_user
      POSTGRES_PASSWORD: VotreMotDePasseSecurise123!
      POSTGRES_DB: apsem_db
      # Permet les connexions externes
      POSTGRES_HOST_AUTH_METHOD: md5
    ports:
      # Port externe:Port interne
      - "5432:5432"
    volumes:
      # Données persistantes
      - postgres_data:/var/lib/postgresql/data
      # Configuration PostgreSQL personnalisée
      - ./postgresql.conf:/etc/postgresql/postgresql.conf
    command: >
      postgres
      -c listen_addresses='*'
      -c max_connections=100
    networks:
      - db_network

volumes:
  postgres_data:
    driver: local

networks:
  db_network:
    driver: bridge
```

### Créer le fichier de configuration PostgreSQL (optionnel)
```bash
nano postgresql.conf
```

Contenu:
```conf
# Connexions
listen_addresses = '*'
max_connections = 100

# Mémoire
shared_buffers = 256MB
effective_cache_size = 1GB

# Logs
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d.log'
log_statement = 'all'
log_duration = on
```

### Lancer le conteneur
```bash
docker-compose up -d

# Vérifier que le conteneur est lancé
docker ps

# Voir les logs
docker logs apsem-postgres
```

## 🔐 Étape 2: Configurer le pare-feu du VPS

### Autoriser le port PostgreSQL
```bash
# Installer UFW si nécessaire
apt install ufw -y

# Autoriser SSH (IMPORTANT - à faire en premier!)
ufw allow 22/tcp

# Autoriser PostgreSQL
ufw allow 5432/tcp

# Activer le pare-feu
ufw enable

# Vérifier le statut
ufw status
```

### Option de sécurité avancée (recommandé)
Pour n'autoriser que VOTRE IP à se connecter:
```bash
# Remplacer VOTRE_IP par votre adresse IP publique
ufw allow from VOTRE_IP to any port 5432

# Pour connaître votre IP publique (depuis votre PC local):
# curl ifconfig.me
```

## 🔧 Étape 3: Configurer PostgreSQL pour les connexions externes

### Accéder au conteneur
```bash
docker exec -it apsem-postgres bash
```

### Modifier pg_hba.conf
```bash
# Dans le conteneur
cd /var/lib/postgresql/data
echo "host    all             all             0.0.0.0/0               md5" >> pg_hba.conf

# Quitter le conteneur
exit
```

### Redémarrer le conteneur
```bash
docker restart apsem-postgres
```

## 💻 Étape 4: Se connecter depuis votre PC local

### Option 1: Modifier le .env de votre projet local

Dans votre fichier `server/.env` sur votre PC:
```env
# Remplacer par l'IP de votre VPS
DATABASE_URL="postgresql://apsem_user:VotreMotDePasseSecurise123!@IP_VPS:5432/apsem_db"
```

### Option 2: Tester la connexion avec psql (si installé)
```bash
# Sur votre PC local
psql -h IP_VPS -p 5432 -U apsem_user -d apsem_db
# Entrer le mot de passe quand demandé
```

### Option 3: Tester avec un client GUI

**Avec DBeaver:**
1. Ouvrir DBeaver
2. Nouvelle connexion → PostgreSQL
3. Host: `IP_VPS`
4. Port: `5432`
5. Database: `apsem_db`
6. Username: `apsem_user`
7. Password: `VotreMotDePasseSecurise123!`
8. Tester la connexion

**Avec pgAdmin:**
1. Ouvrir pgAdmin
2. Créer un nouveau serveur
3. General → Name: `VPS Hostinger`
4. Connection → Host: `IP_VPS`
5. Connection → Port: `5432`
6. Connection → Database: `apsem_db`
7. Connection → Username: `apsem_user`
8. Connection → Password: `VotreMotDePasseSecurise123!`
9. Save password: ✓
10. Sauvegarder

## 🧪 Étape 5: Tester avec votre application locale

### Modifier votre configuration Prisma
Dans `server/.env`:
```env
DATABASE_URL="postgresql://apsem_user:VotreMotDePasseSecurise123!@IP_VPS:5432/apsem_db"
JWT_SECRET=votre_secret_jwt
PORT=5000
```

### Exécuter les migrations
```bash
cd server

# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate deploy

# Ou créer une nouvelle migration
npx prisma migrate dev --name init

# Seed la base de données (optionnel)
npm run seed
```

### Démarrer votre backend local
```bash
npm run dev
```

Votre application locale utilise maintenant la base de données sur le VPS!

## 🔒 Sécurité Avancée (Recommandé)

### 1. Créer un utilisateur avec des privilèges limités
```bash
# Se connecter au conteneur
docker exec -it apsem-postgres psql -U apsem_user -d apsem_db

# Dans psql
CREATE USER apsem_dev WITH PASSWORD 'MotDePasseDev123!';
GRANT CONNECT ON DATABASE apsem_db TO apsem_dev;
GRANT USAGE ON SCHEMA public TO apsem_dev;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO apsem_dev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO apsem_dev;

# Quitter
\q
```

Utilisez `apsem_dev` pour le développement local.

### 2. Utiliser un tunnel SSH (plus sécurisé)

Au lieu d'exposer le port 5432, créez un tunnel SSH:

```bash
# Sur votre PC local
ssh -L 5432:localhost:5432 root@IP_VPS -N

# Dans un autre terminal, utilisez:
DATABASE_URL="postgresql://apsem_user:password@localhost:5432/apsem_db"
```

Avantages:
- Le port 5432 n'est pas exposé publiquement
- Connexion chiffrée via SSH
- Plus sécurisé

Pour automatiser, créez un script sur votre PC:
```bash
# tunnel-db.sh
#!/bin/bash
echo "🔐 Création du tunnel SSH vers la base de données..."
ssh -L 5432:localhost:5432 root@IP_VPS -N
```

### 3. Bloquer le port 5432 et utiliser uniquement SSH
```bash
# Sur le VPS
ufw delete allow 5432
ufw allow 22/tcp
```

Puis utilisez toujours le tunnel SSH pour vous connecter.

## 📊 Commandes Utiles

### Gestion du conteneur
```bash
# Voir les logs
docker logs -f apsem-postgres

# Redémarrer
docker restart apsem-postgres

# Arrêter
docker stop apsem-postgres

# Démarrer
docker start apsem-postgres

# Statistiques d'utilisation
docker stats apsem-postgres
```

### Sauvegarde et restauration
```bash
# Créer une sauvegarde
docker exec apsem-postgres pg_dump -U apsem_user apsem_db > backup_$(date +%Y%m%d).sql

# Restaurer une sauvegarde
docker exec -i apsem-postgres psql -U apsem_user apsem_db < backup_20241201.sql

# Sauvegarde automatique quotidienne
echo "0 2 * * * docker exec apsem-postgres pg_dump -U apsem_user apsem_db > /var/backups/apsem_db_\$(date +\%Y\%m\%d).sql" | crontab -
```

### Surveillance
```bash
# Se connecter à la base
docker exec -it apsem-postgres psql -U apsem_user -d apsem_db

# Lister les bases de données
\l

# Lister les tables
\dt

# Voir les connexions actives
SELECT * FROM pg_stat_activity;

# Taille de la base de données
SELECT pg_size_pretty(pg_database_size('apsem_db'));

# Quitter
\q
```

## 🆘 Dépannage

### Problème: Impossible de se connecter

1. **Vérifier que le conteneur est lancé**
```bash
docker ps | grep apsem-postgres
```

2. **Vérifier les logs**
```bash
docker logs apsem-postgres
```

3. **Vérifier le pare-feu**
```bash
ufw status
# Le port 5432 doit être ALLOW
```

4. **Tester depuis le VPS**
```bash
# Installer psql sur le VPS
apt install postgresql-client -y

# Tester la connexion
psql -h localhost -p 5432 -U apsem_user -d apsem_db
```

5. **Vérifier pg_hba.conf**
```bash
docker exec -it apsem-postgres cat /var/lib/postgresql/data/pg_hba.conf
# Doit contenir: host all all 0.0.0.0/0 md5
```

### Problème: Connexion refusée

- Vérifiez que votre IP n'a pas changé (si vous avez restreint par IP)
- Vérifiez que votre FAI ne bloque pas le port 5432
- Essayez avec le tunnel SSH

### Problème: Authentication failed

- Vérifiez le mot de passe dans DATABASE_URL
- Vérifiez que l'utilisateur existe
- Recréez l'utilisateur si nécessaire

## 📌 Récapitulatif

**Sur le VPS:**
- ✅ Conteneur PostgreSQL sur le port 5432
- ✅ Pare-feu configuré
- ✅ pg_hba.conf configuré pour connexions externes

**Sur votre PC:**
- ✅ DATABASE_URL pointant vers le VPS
- ✅ Connexion testée
- ✅ Migrations exécutées

Votre application locale utilise maintenant la base de données distante sur le VPS Hostinger!