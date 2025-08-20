
# Orchestration et Déploiement

## **Introduction**

L’orchestration et le déploiement des services sont au cœur de la gestion de l’architecture. Le projet repose sur une conteneurisation via Docker et une orchestration adaptée selon l’environnement (local ou production). Ce document détaille les approches et outils utilisés pour gérer les déploiements.

## **Conteneurisation**

L’ensemble des services de l’application est conteneurisé avec Docker, permettant une isolation des dépendances et une simplification du processus de déploiement.

### **Pourquoi Docker ?**

- Isolation des environnements pour chaque service (frontend, backend, base de données).
- Réduction des conflits de dépendances entre les services.
- Simplification du processus de développement, de test et de déploiement.

### **Structure des Conteneurs**

1. **Frontend** :
    - Serveur Nginx hébergeant l’application Phaser.js.
    - Image légère (ex. `nginx:alpine`).
2. **Backend** :
    - Chaque microservice backend est déployé dans un conteneur Docker distinct.
    - Images basées sur `node:alpine` pour minimiser la taille.
3. **Base de Données** :
    - Conteneur PostgreSQL pour gérer le stockage des données relationnelles.
4. **Monitoring** :
    - Prometheus et Grafana déployés en conteneurs séparés pour la collecte et la visualisation des métriques.

## **Orchestration**

Pour coordonner les conteneurs et assurer la scalabilité, deux approches sont envisagées selon l’environnement :

### **Développement Local : Docker Compose**

- **Pourquoi Docker Compose ?**
  - Simple à utiliser pour gérer plusieurs conteneurs en local.
  - Permet de définir les relations entre les services dans un fichier unique (`docker-compose.yml`).

### **Production : Kubernetes (K3s)**

- **Pourquoi Kubernetes (K3s) ?**
  - Version légère de Kubernetes, adaptée aux ressources limitées des Raspberry Pi.
  - Gestion automatique des déploiements, équilibrage de charge et tolérance aux pannes.

#### **Processus de Déploiement avec K3s**

- **Installer K3s sur le master node** :

  ```bash
  curl -sfL https://get.k3s.io | sh
  ```

- **Ajouter les worker nodes au cluster** :

  ```bash
  k3s agent --server https://<master-node-ip>:6443 --token <cluster-token>
  ```

- **Déployer les services avec des fichiers manifestes YAML**

## **Déploiement sur Raspberry Pi**

### **Préparation du Cluster**

1. **Configuration des Raspberry Pi** :
    - Installer un OS léger comme Raspberry Pi OS Lite.
    - Mettre à jour le système avec `apt-get update && apt-get upgrade`.
2. **Installation de Docker** :
    - Utiliser `curl -fsSL https://get.docker.com | sh` pour installer Docker.
3. **Installation de K3s** (optionnel pour l’orchestration en production) :
    - Exécuter la commande `curl -sfL https://get.k3s.io | sh`.

### **Déploiement des Services**

- **Avec Docker Compose** :
  - Copier le fichier `docker-compose.yml` sur le master node.
  - Lancer les services avec :

    ```bash
    docker-compose up -d
    ```

- **Avec K3s** :
  - Appliquer les manifestes Kubernetes :

    ```bash
    kubectl apply -f backend-deployment.yml
    ```

## **Monitoring**

### **Prometheus**

- Collecte des métriques système (CPU, mémoire, latence réseau).
- Permet de surveiller les performances des conteneurs et du cluster.

### **Grafana**

- Visualisation des métriques collectées par Prometheus.
- Configuration de tableaux de bord et d’alertes pour les anomalies.
