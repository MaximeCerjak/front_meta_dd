#!/bin/bash
set -e

echo "🎨 Configuration du frontend DigitalDrifter..."

# Vérification des fichiers critiques
if [ ! -f "/usr/share/nginx/html/index.html" ]; then
    echo "❌ Erreur: index.html non trouvé!"
    exit 1
fi

# Configuration dynamique selon l'environnement
if [ "$NODE_ENV" = "production" ]; then
    echo "🎯 Configuration production"
    # Remplacer les URLs de développement par celles de production
    find /usr/share/nginx/html -name "*.js" -exec sed -i 's|http://localhost:8080|https://api.digitaldrifter.local|g' {} \;
elif [ "$NODE_ENV" = "staging" ]; then
    echo "🚀 Configuration staging"
    find /usr/share/nginx/html -name "*.js" -exec sed -i 's|http://localhost:8080|https://staging-api.digitaldrifter.local|g' {} \;
fi

# Vérification des assets Phaser.js
ASSETS_DIR="/usr/share/nginx/html/assets"
if [ -d "$ASSETS_DIR" ]; then
    ASSET_COUNT=$(find $ASSETS_DIR -type f | wc -l)
    echo "📦 $ASSET_COUNT assets trouvés"
    
    # Vérification des fichiers critiques pour Phaser.js
    [ -f "$ASSETS_DIR/preload.json" ] && echo "✅ preload.json trouvé" || echo "⚠️  preload.json manquant"
    [ -f "$ASSETS_DIR/atlas.json" ] && echo "✅ atlas.json trouvé" || echo "ℹ️  atlas.json optionnel"
fi

echo "✅ Configuration frontend terminée"