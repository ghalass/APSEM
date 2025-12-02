#!/bin/bash

set -e  # Arrêter en cas d'erreur

echo "=== DÉPLOIEMENT APSEM AVEC NGINX ==="
echo "Date: $(date)"
echo ""

# 1. Vérifier et créer la structure Nginx si nécessaire
echo "🔧 1. Configuration Nginx..."
if [ ! -d "./nginx" ]; then
    echo "   📁 Création de la structure Nginx..."
    
    # Créer les dossiers
    mkdir -p nginx nginx/ssl nginx/conf.d
    
    # Créer les fichiers de configuration
    cat > nginx/Dockerfile << 'NGINX_DOCKERFILE'
FROM nginx:alpine

RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

RUN mkdir -p /var/log/nginx

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
NGINX_DOCKERFILE

    cat > nginx/nginx.conf << 'NGINX_CONF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    include /etc/nginx/conf.d/*.conf;
}
NGINX_CONF

    cat > nginx/conf.d/apsem.conf << 'NGINX_APPS'
# Frontend - apsem.ghalass.com
server {
    listen 80;
    server_name apsem.ghalass.com;
    
    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    access_log /var/log/nginx/apsem_frontend_access.log;
    error_log /var/log/nginx/apsem_frontend_error.log;
}

# Backend API - apsem.api.ghalass.com
server {
    listen 80;
    server_name apsem.api.ghalass.com;
    
    client_max_body_size 10M;
    
    location / {
        proxy_pass http://backend:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://apsem.ghalass.com' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
        }
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    location /health {
        proxy_pass http://backend:4000/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        access_log off;
    }
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    access_log /var/log/nginx/apsem_backend_access.log;
    error_log /var/log/nginx/apsem_backend_error.log;
}
NGINX_APPS

    echo "   ✅ Structure Nginx créée"
else
    echo "   ✅ Structure Nginx existante"
fi
echo ""

# 2. Arrêt propre
echo "🔴 2. Arrêt des services..."
docker-compose down || true
echo "✅ Services arrêtés"
echo ""

# 3. Nettoyage
echo "🧹 3. Nettoyage..."
docker system prune -f
docker builder prune -a -f
echo "✅ Nettoyage terminé"
echo ""

# 4. Vérification préalable
echo "🔍 4. Vérification des fichiers..."
if [ ! -f "./server/pnpm-lock.yaml" ]; then
    echo "⚠️  Attention: pnpm-lock.yaml non trouvé dans server/"
fi
echo "✅ Vérifications terminées"
echo ""

# 5. Reconstruction
echo "🔨 5. Reconstruction des services..."
docker-compose build --progress=plain
echo "✅ Services reconstruits avec succès"
echo ""

# 6. Démarrage
echo "🚀 6. Démarrage des services..."
docker-compose up -d
echo "✅ Services démarrés"
echo ""

# 7. Attente intelligente
echo "⏳ 7. Attente du démarrage complet..."
for i in {1..30}; do
    if docker-compose ps postgres 2>/dev/null | grep -q "(healthy)"; then
        echo "✅ PostgreSQL prêt après ${i}s"
        break
    fi
    sleep 1
done

# Attente pour les autres services
sleep 10
echo ""

# 8. Vérifications
echo "🔍 8. Vérifications..."

echo "   📊 Services Docker:"
docker-compose ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "   🌐 Test des domaines (si DNS configuré):"
declare -A DOMAINS=(
    ["Frontend"]="apsem.ghalass.com"
    ["Backend API"]="apsem.api.ghalass.com"
)

for service in "${!DOMAINS[@]}"; do
    domain="${DOMAINS[$service]}"
    if curl -s -f --max-time 5 "http://$domain" > /dev/null 2>&1; then
        echo "      ✅ $service: http://$domain"
    else
        echo "      ⚠️  $service: http://$domain (non accessible - vérifiez DNS)"
    fi
done
echo ""

# 9. Tests finaux
echo "🧪 9. Tests finaux..."
echo "   🔗 Test des connexions internes:"
declare -A ENDPOINTS=(
    ["Frontend (via Nginx)"]="http://localhost"
    ["Backend API (via Nginx)"]="http://localhost"
    ["Backend Health"]="http://localhost/health"
)

for service in "${!ENDPOINTS[@]}"; do
    url="${ENDPOINTS[$service]}"
    if curl -s -f --max-time 5 "$url" > /dev/null 2>&1; then
        echo "      ✅ $service"
    else
        echo "      ⚠️  $service (échec)"
    fi
done
echo ""

# 10. Résumé
echo "📋 10. RÉSUMÉ DU DÉPLOIEMENT"
echo ""
echo "   🎯 URLs Publiques (après configuration DNS):"
echo "     - Frontend:    http://apsem.ghalass.com"
echo "     - Backend API: http://apsem.api.ghalass.com"
echo ""
echo "   🔧 Configuration requise:"
echo "     1. Ajoutez ces entrées DNS dans Hostinger:"
echo "        A    apsem         → VOTRE_IP_VPS"
echo "        A    apsem.api     → VOTRE_IP_VPS"
echo ""
echo "   📊 Logs:"
echo "     - Nginx:        docker-compose logs -f nginx"
echo "     - Backend:      docker-compose logs -f backend"
echo "     - Frontend:     docker-compose logs -f frontend"
echo ""
echo "   🔒 Prochaine étape (SSL):"
echo "     docker-compose exec nginx apk add certbot python3 py3-pip"
echo "     docker-compose exec nginx certbot --nginx -d apsem.ghalass.com -d apsem.api.ghalass.com"
echo ""

echo "=== ✅ DÉPLOIEMENT COMPLET AVEC NGINX ==="