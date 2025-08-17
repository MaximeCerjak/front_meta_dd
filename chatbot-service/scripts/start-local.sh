#!/bin/bash

echo "🚀 Démarrage local du service chatbot..."

# Vérifier si le fichier .env existe
if [ ! -f ".env" ]; then
    echo "⚠️ Fichier .env manquant. Création d'un exemple..."
    cat > .env << EOF
# Configuration locale
PORT=6000
NODE_ENV=development

# Clé API OpenAI (à remplir)
OPENAI_API_KEY=your_openai_api_key_here

# Base de données (optionnel)
# DATABASE_URL=postgresql://user:password@localhost:5432/chatbot_db
EOF
    echo "✅ Fichier .env créé. Veuillez le remplir avec vos vraies valeurs."
    exit 1
fi

# Vérifier les dépendances
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Démarrer en mode développement
echo "🔧 Démarrage en mode développement avec nodemon..."
npm run dev