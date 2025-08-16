# Makefile pour DigitalDrifter
.PHONY: help dev prod build-dev build-prod clean logs status

# Variables
COMPOSE_DEV = docker-compose -f docker-compose.dev.yml
COMPOSE_PROD = docker-compose -f docker-compose.prod.yml

help: ## Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Commandes de développement
dev: ## Lance l'environnement de développement
	$(COMPOSE_DEV) up -d --build

dev-logs: ## Affiche les logs de développement
	$(COMPOSE_DEV) logs -f

dev-stop: ## Arrête l'environnement de développement
	$(COMPOSE_DEV) down

dev-clean: ## Nettoie l'environnement de développement
	$(COMPOSE_DEV) down -v --remove-orphans
	docker system prune -f

# Commandes de production
prod: ## Lance l'environnement de production
	$(COMPOSE_PROD) up -d --build

prod-logs: ## Affiche les logs de production
	$(COMPOSE_PROD) logs -f

prod-stop: ## Arrête l'environnement de production
	$(COMPOSE_PROD) down

prod-clean: ## Nettoie l'environnement de production
	$(COMPOSE_PROD) down -v --remove-orphans

# Builds spécifiques
build-dev: ## Build uniquement les images de développement
	$(COMPOSE_DEV) build

build-prod: ## Build uniquement les images de production
	$(COMPOSE_PROD) build

build-frontend-dev: ## Build uniquement le frontend de développement
	$(COMPOSE_DEV) build frontend-dev

build-frontend-prod: ## Build uniquement le frontend de production
	$(COMPOSE_PROD) build frontend-prod

# Utilitaires
status: ## Affiche le statut des containers
	@echo "=== Développement ==="
	$(COMPOSE_DEV) ps
	@echo "=== Production ==="
	$(COMPOSE_PROD) ps

clean: ## Nettoie tout (dev + prod)
	$(COMPOSE_DEV) down -v --remove-orphans || true
	$(COMPOSE_PROD) down -v --remove-orphans || true
	docker system prune -f
	docker volume prune -f

shell-frontend-dev: ## Accède au shell du frontend de développement
	$(COMPOSE_DEV) exec frontend-dev sh

shell-frontend-prod: ## Accède au shell du frontend de production
	$(COMPOSE_PROD) exec frontend-prod sh

# Tests
test-frontend: ## Lance les tests du frontend
	$(COMPOSE_DEV) exec frontend-dev npm test

lint-frontend: ## Lance le linting du frontend
	$(COMPOSE_DEV) exec frontend-dev npm run lint

# Surveillance
watch-logs: ## Surveille tous les logs en temps réel
	$(COMPOSE_DEV) logs -f frontend-dev gateway-service

# Installation initiale
setup: ## Configuration initiale du projet
	@echo "🏗️  Configuration initiale..."
	cp .env.example .env || echo "Fichier .env.example non trouvé"
	$(COMPOSE_DEV) build
	@echo "✅ Configuration terminée"
	@echo "💡 Lancez 'make dev' pour démarrer le développement"