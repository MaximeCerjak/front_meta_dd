# scripts.ps1 - Scripts DigitalDrifter pour Windows

param(
    [Parameter(Mandatory=$true)]
    [string]$Command
)

# Variables
$COMPOSE_DEV = "docker-compose -f docker-compose.dev.yml"
$COMPOSE_PROD = "docker-compose.prod.yml"

function Show-Help {
    Write-Host "=== Scripts DigitalDrifter ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Développement:" -ForegroundColor Yellow
    Write-Host "  dev          - Lance l'environnement de développement"
    Write-Host "  dev-logs     - Affiche les logs de développement"
    Write-Host "  dev-stop     - Arrête l'environnement de développement"
    Write-Host "  dev-clean    - Nettoie l'environnement de développement"
    Write-Host ""
    Write-Host "Production:" -ForegroundColor Yellow
    Write-Host "  prod         - Lance l'environnement de production"
    Write-Host "  prod-logs    - Affiche les logs de production"
    Write-Host "  prod-stop    - Arrête l'environnement de production"
    Write-Host ""
    Write-Host "Builds:" -ForegroundColor Yellow
    Write-Host "  build-dev    - Build les images de développement"
    Write-Host "  build-prod   - Build les images de production"
    Write-Host ""
    Write-Host "Utilitaires:" -ForegroundColor Yellow
    Write-Host "  status       - Affiche le statut des containers"
    Write-Host "  clean        - Nettoie tout"
    Write-Host ""
    Write-Host "Exemples d'utilisation:" -ForegroundColor Green
    Write-Host "  .\scripts.ps1 dev"
    Write-Host "  .\scripts.ps1 dev-logs"
    Write-Host "  .\scripts.ps1 status"
}

switch ($Command) {
    "help" { Show-Help }
    "dev" {
        Write-Host "🚀 Lancement de l'environnement de développement..." -ForegroundColor Green
        Invoke-Expression "$COMPOSE_DEV up -d --build"
    }
    "dev-logs" {
        Write-Host "📋 Affichage des logs de développement..." -ForegroundColor Blue
        Invoke-Expression "$COMPOSE_DEV logs -f"
    }
    "dev-stop" {
        Write-Host "🛑 Arrêt de l'environnement de développement..." -ForegroundColor Yellow
        Invoke-Expression "$COMPOSE_DEV down"
    }
    "dev-clean" {
        Write-Host "🧹 Nettoyage de l'environnement de développement..." -ForegroundColor Red
        Invoke-Expression "$COMPOSE_DEV down -v --remove-orphans"
        docker system prune -f
    }
    "prod" {
        Write-Host "🏭 Lancement de l'environnement de production..." -ForegroundColor Green
        Invoke-Expression "docker-compose -f $COMPOSE_PROD up -d --build"
    }
    "prod-logs" {
        Write-Host "📋 Affichage des logs de production..." -ForegroundColor Blue
        Invoke-Expression "docker-compose -f $COMPOSE_PROD logs -f"
    }
    "prod-stop" {
        Write-Host "🛑 Arrêt de l'environnement de production..." -ForegroundColor Yellow
        Invoke-Expression "docker-compose -f $COMPOSE_PROD down"
    }
    "build-dev" {
        Write-Host "🏗️ Build des images de développement..." -ForegroundColor Cyan
        Invoke-Expression "$COMPOSE_DEV build"
    }
    "build-prod" {
        Write-Host "🏗️ Build des images de production..." -ForegroundColor Cyan
        Invoke-Expression "docker-compose -f $COMPOSE_PROD build"
    }
    "status" {
        Write-Host "=== Statut Développement ===" -ForegroundColor Cyan
        Invoke-Expression "$COMPOSE_DEV ps"
        Write-Host ""
        Write-Host "=== Statut Production ===" -ForegroundColor Cyan
        Invoke-Expression "docker-compose -f $COMPOSE_PROD ps"
    }
    "clean" {
        Write-Host "🧹 Nettoyage complet..." -ForegroundColor Red
        try { Invoke-Expression "$COMPOSE_DEV down -v --remove-orphans" } catch {}
        try { Invoke-Expression "docker-compose -f $COMPOSE_PROD down -v --remove-orphans" } catch {}
        docker system prune -f
        docker volume prune -f
    }
    "shell-frontend-dev" {
        Write-Host "🐚 Accès au shell du frontend de développement..." -ForegroundColor Magenta
        Invoke-Expression "$COMPOSE_DEV exec frontend-dev sh"
    }
    default {
        Write-Host "❌ Commande inconnue: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help
    }
}