#!/bin/bash
set -e

echo "🧪 Lancement de la suite de tests complète..."

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé"
    exit 1
fi

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    print_warning "Installation des dépendances..."
    npm ci
fi

print_status "Vérification du linting..."
npm run lint

print_status "Exécution des tests unitaires..."
npm run test:coverage

print_status "Vérification de la sécurité..."
npm audit --audit-level=moderate

print_status "Tous les tests sont passés avec succès! 🎉"

echo ""
echo "📊 Résumé du coverage:"
if [ -f "coverage/lcov-report/index.html" ]; then
    echo "Rapport détaillé disponible dans: coverage/lcov-report/index.html"
fi
