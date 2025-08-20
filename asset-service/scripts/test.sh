#!/bin/bash
set -e

echo "🧪 Démarrage des tests du Asset Service"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' 

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    log_error "Node.js n'est pas installé"
    exit 1
fi

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    log_error "npm n'est pas installé"
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2)
MIN_NODE_VERSION="18.0.0"

if ! npx semver --range ">=$MIN_NODE_VERSION" "$NODE_VERSION" &> /dev/null; then
    log_error "Node.js version $NODE_VERSION détectée. Version minimum requise: $MIN_NODE_VERSION"
    exit 1
fi

log_info "Node.js version: $NODE_VERSION ✅"

if [ ! -d "node_modules" ]; then
    log_info "Installation des dépendances..."
    npm install
fi

mkdir -p src/uploads/test
mkdir -p coverage

export NODE_ENV=test
export DB_NAME=asset_service_test
export DB_USER=test_user
export DB_PASSWORD=test_password
export DB_HOST=localhost
export SERVICE_URL=http://localhost:4000
export FRONT_URL=http://localhost:3002

log_info "Variables d'environnement configurées pour les tests"

# Fonction pour nettoyer avant de quitter
cleanup() {
    log_info "Nettoyage en cours..."
    rm -rf src/uploads/test
}

# Configurer le nettoyage automatique
trap cleanup EXIT

# Exécuter les différents types de tests
run_tests() {
    local test_type=$1
    local test_pattern=$2
    
    log_info "Exécution des tests: $test_type"
    
    if npm run test -- --testPathPattern="$test_pattern" --verbose; then
        log_info "✅ Tests $test_type réussis"
        return 0
    else
        log_error "❌ Tests $test_type échoués"
        return 1
    fi
}

# Menu principal
case "${1:-all}" in
    "lint")
        log_info "Lancement du linting..."
        npm run lint
        ;;
    "unit")
        run_tests "unitaires" "controllers|models"
        ;;
    "integration")
        run_tests "d'intégration" "integration"
        ;;
    "e2e")
        run_tests "end-to-end" "e2e"
        ;;
    "coverage")
        log_info "Génération du rapport de couverture..."
        npm run test:coverage
        log_info "Rapport de couverture généré dans ./coverage/"
        ;;
    "ci")
        log_info "Exécution de tous les tests en mode CI..."
        npm run lint
        npm run test:ci
        ;;
    "all")
        log_info "Exécution de tous les tests..."
        
        # Linting
        if npm run lint; then
            log_info "✅ Linting réussi"
        else
            log_error "❌ Linting échoué"
            exit 1
        fi
        
        # Tests unitaires
        if run_tests "unitaires" "controllers|models"; then
            log_info "✅ Tests unitaires réussis"
        else
            exit 1
        fi
        
        # Tests d'intégration
        if run_tests "d'intégration" "integration"; then
            log_info "✅ Tests d'intégration réussis"
        else
            exit 1
        fi
        
        # Tests E2E
        if run_tests "end-to-end" "e2e"; then
            log_info "✅ Tests E2E réussis"
        else
            exit 1
        fi
        
        # Génération du rapport de couverture
        log_info "Génération du rapport de couverture final..."
        npm run test:coverage
        
        log_info "🎉 Tous les tests sont passés avec succès!"
        ;;
    "watch")
        log_info "Démarrage des tests en mode watch..."
        npm run test:watch
        ;;
    "help")
        echo "Usage: $0 [option]"
        echo ""
        echo "Options:"
        echo "  lint        - Exécuter le linting"
        echo "  unit        - Exécuter les tests unitaires"
        echo "  integration - Exécuter les tests d'intégration"
        echo "  e2e         - Exécuter les tests end-to-end"
        echo "  coverage    - Générer le rapport de couverture"
        echo "  ci          - Exécuter tous les tests en mode CI"
        echo "  all         - Exécuter tous les tests (par défaut)"
        echo "  watch       - Exécuter les tests en mode watch"
        echo "  help        - Afficher cette aide"
        ;;
    *)
        log_error "Option inconnue: $1"
        log_info "Utilisez '$0 help' pour voir les options disponibles"
        exit 1
        ;;
esac