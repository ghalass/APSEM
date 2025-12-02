#!/bin/bash

echo "=== CONFIGURATION SSL AUTOMATIQUE ==="

# Vérifier que les domaines sont accessibles
echo "🔍 Vérification des domaines..."
for domain in apsem.ghalass.com apsem.api.ghalass.com; do
    if ! nslookup $domain > /dev/null 2>&1; then
        echo "❌ $domain n'est pas résolu. Configurez le DNS d'abord."
        exit 1
    fi
done

# Installer Certbot dans le conteneur Nginx
echo "📦 Installation de Certbot..."
docker-compose exec nginx apk add --no-cache certbot python3 py3-pip

# Obtenir les certificats
echo "🔐 Obtention des certificats SSL..."
docker-compose exec nginx certbot --nginx \
  -d apsem.ghalass.com \
  -d apsem.api.ghalass.com \
  --email admin@ghalass.com \
  --agree-tos \
  --non-interactive \
  --redirect

# Redémarrer Nginx
echo "🔄 Redémarrage de Nginx..."
docker-compose restart nginx

echo "✅ SSL configuré !"
echo "🎯 URLs HTTPS:"
echo "   - https://apsem.ghalass.com"
echo "   - https://apsem.api.ghalass.com"