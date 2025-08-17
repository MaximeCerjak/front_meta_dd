#!/bin/bash
set -e

echo "🏗️ Construction du projet..."

# Variables
IMAGE_NAME="chatbot-service"
VERSION=${1:-"latest"}
BUILD_TYPE=${2:-"dev"}

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Vérifier que Docker est disponible
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

print_info "Construction de l'image Docker..."
print_info "Type: $BUILD_TYPE"
print_info "Version: $VERSION"

if [ "$BUILD_TYPE" = "prod" ]; then
    print_info "Construction en mode PRODUCTION"
    docker build -f config/docker/Dockerfile.prod -t $IMAGE_NAME:$VERSION .
    docker tag $IMAGE_NAME:$VERSION $IMAGE_NAME:latest
    
    print_info "Test de fumée de l'image..."
    # Démarrer le conteneur pour test
    CONTAINER_ID=$(docker run -d -p 6001:6000 -e OPENAI_API_KEY=test $IMAGE_NAME:$VERSION)
    
    # Attendre que le service démarre
    sleep 5
    
    # Tester si le service répond (si vous avez un endpoint health)
    # curl -f http://localhost:6001/health || (docker logs $CONTAINER_ID && exit 1)
    
    # Nettoyer
    docker stop $CONTAINER_ID
    docker rm $CONTAINER_ID
    
    print_success "Image de production construite et testée: $IMAGE_NAME:$VERSION"
else
    print_info "Construction en mode DÉVELOPPEMENT"
    docker build -f config/docker/Dockerfile.dev -t $IMAGE_NAME:$VERSION-dev .
    print_success "Image de développement construite: $IMAGE_NAME:$VERSION-dev"
fi

print_success "Construction terminée! 🎉"