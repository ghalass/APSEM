#!/bin/bash

set -e  # Arrêter en cas d'erreur

echo "=== DÉPLOIEMENT APSEM (pnpm) ==="
echo "Date: $(date)"
echo ""

# 1. Arrêt propre
echo "🔴 1. Arrêt des services..."
docker-compose down || true
echo "✅ Services arrêtés"
echo ""

# 2. Nettoyage
echo "🧹 2. Nettoyage..."
docker system prune -f

# Nettoyage spécifique pnpm
echo "🧽 Nettoyage du cache pnpm..."
docker builder prune -a -f
echo "✅ Nettoyage terminé"
echo ""

# 3. Vérification préalable
echo "🔍 3. Vérification des fichiers pnpm..."
if [ ! -f "./server/pnpm-lock.yaml" ]; then
    echo "⚠️  Attention: pnpm-lock.yaml non trouvé dans server/"
    echo "   Exécutez: cd server && pnpm install"
fi
echo "✅ Vérifications terminées"
echo ""

# 4. Reconstruction
echo "🔨 4. Reconstruction des services..."
if docker-compose build --no-cache --progress=plain; then
    echo "✅ Services reconstruits avec succès"
else
    echo "❌ Échec de la reconstruction"
    exit 1
fi
echo ""

# 5. Démarrage
echo "🚀 5. Démarrage des services..."
docker-compose up -d
echo "✅ Services démarrés"
echo ""

# 6. Attente intelligente
echo "⏳ 6. Attente du démarrage complet..."
for i in {1..30}; do
    if docker-compose ps postgres 2>/dev/null | grep -q "(healthy)"; then
        echo "✅ PostgreSQL prêt après ${i}s"
        break
    fi
    sleep 1
    if [ $i -eq 30 ]; then
        echo "⚠️  PostgreSQL lent à démarrer, poursuite..."
    fi
done

# Attente supplémentaire pour le backend
sleep 5
echo ""

# 7. Vérifications
echo "🔍 7. Vérifications..."

# 7.1 PostgreSQL
echo "   📊 PostgreSQL:"
if docker-compose exec -T postgres pg_isready -U postgres 2>/dev/null; then
    echo "      ✅ Connecté"
else
    echo "      ❌ Non connecté"
fi

# 7.2 Backend (vérification pnpm)
echo "   ⚙️  Backend:"
if docker-compose ps backend 2>/dev/null | grep -q "Up"; then
    echo "      ✅ En cours d'exécution"
    
    # Vérifier pnpm
    echo "      📦 pnpm:"
    if docker-compose exec backend pnpm --version 2>/dev/null; then
        echo "      ✅ Installé"
        
        # Vérifier Prisma avec pnpm
        echo "      🔧 Prisma:"
        if docker-compose exec backend pnpm exec prisma --version 2>/dev/null; then
            echo "      ✅ Version: $(docker-compose exec backend pnpm exec prisma --version 2>/dev/null)"
        else
            echo "      ❌ Non détecté"
        fi
    else
        echo "      ❌ pnpm non disponible"
    fi
else
    echo "      ❌ Backend non démarré"
    docker-compose logs backend --tail=20
fi

# 7.3 Frontend
echo "   🌐 Frontend:"
if docker-compose ps frontend 2>/dev/null | grep -q "Up"; then
    echo "      ✅ En cours d'exécution"
else
    echo "      ⚠️  Non démarré"
fi
echo ""

# 8. Migrations avec pnpm
echo "🗃️  8. Migrations de base de données..."
echo "   Vérification de l'état..."
if docker-compose exec backend pnpm exec prisma migrate status 2>/dev/null; then
    echo "   Application des migrations avec pnpm..."
    if docker-compose exec backend pnpm exec prisma migrate deploy 2>/dev/null; then
        echo "      ✅ Migrations appliquées"
    else
        echo "      ⚠️  Échec des migrations"
        echo "      Tentative alternative..."
        docker-compose exec backend pnpm exec prisma db push 2>/dev/null || true
    fi
else
    echo "      ⚠️  Impossible de vérifier les migrations"
fi
echo ""

# 9. Tests finaux
echo "🧪 9. Tests finaux..."
echo "   Test des services (attente 3 secondes)..."
sleep 3

# Tester les endpoints
echo "   🔗 Test des connexions:"
declare -A ENDPOINTS=(
    ["Frontend"]="http://localhost:3000"
    ["Backend API"]="http://localhost:4000"
    ["Backend Health"]="http://localhost:4000/health"
)

for service in "${!ENDPOINTS[@]}"; do
    url="${ENDPOINTS[$service]}"
    if curl -s -f --max-time 5 "$url" > /dev/null 2>&1; then
        echo "      ✅ $service: $url"
    else
        echo "      ❌ $service: $url (échec)"
    fi
done
echo ""

# 10. Résumé
echo "📋 10. RÉSUMÉ DU DÉPLOIEMENT PNPM"
echo "   Services:"
docker-compose ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "   🔗 URLs:"
echo "     - Frontend:    http://localhost:3000"
echo "     - Backend API: http://localhost:4000"
echo "     - PostgreSQL:  localhost:5434"
echo ""
echo "   🛠️  Commandes pnpm:"
echo "     - Backend shell: docker-compose exec backend sh"
echo "     - Vérifier pnpm: docker-compose exec backend pnpm --version"
echo "     - Prisma Studio: docker-compose exec backend pnpm exec prisma studio"
echo "     - Logs backend: docker-compose logs -f backend"
echo ""
echo "   📊 Stats pnpm:"
docker-compose exec backend pnpm store status 2>/dev/null || echo "      Store pnpm non disponible"

echo ""
echo "=== ✅ DÉPLOIEMENT PNPM TERMINÉ ==="