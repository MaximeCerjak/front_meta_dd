# Architecture du Projet

## **Résumé de l’Architecture**

1. **Architecture physique** :
    - Un cluster de Raspberry Pi, organisé autour d’un master node et de plusieurs worker nodes.
    - Une infrastructure réseau local, extensible via Ethernet ou Wi-Fi, avec des options de stockage partagé.
2. **Architecture logique** :
    - Une interface utilisateur interactive développée en Phaser.js.
    - Un backend modulaire structuré en microservices (Node.js), connecté à une base de données relationnelle PostgreSQL.
    - Un système de monitoring intégré pour assurer la stabilité et la performance.

### **Architecture Physique**

Le système repose sur un cluster de Raspberry Pi configuré pour maximiser l'efficacité et la résilience dans un environnement à ressources limitées.

- **Cluster de Raspberry Pi** :
  - **Master Node** : Un Raspberry Pi 4 (4 à 8 Go de RAM) configuré pour gérer l'orchestration des microservices et l'hébergement des services critiques tels que le monitoring (Prometheus, Grafana).
  - **Worker Nodes** : Un ou plusieurs Raspberry Pi 3B+ ou 4 (au moins 2 Go de RAM) dédiés à l'exécution des conteneurs applicatifs, notamment le frontend, le backend, et la base de données.
  - **Stockage Partagé** : Utilisation d’un système NFS ou GlusterFS pour le partage des fichiers d’expositions et des données utilisateur.
- **Infrastructure Réseau** :
  - Connexion des Raspberry Pi via un **switch Gigabit** pour réduire la latence, ou via un réseau Wi-Fi robuste avec un point d’accès local.
  - Gestion des adresses IP par attribution statique pour simplifier la configuration et la maintenance.
  - Option pour un accès externe sécurisé via un VPN basé sur WireGuard.

**Références**:

- [Docker Swarm sur un cluster de Raspberry Pi](https://blog.raspot.in/fr/blog/side-project-mise-en-place-de-docker-swarm-sur-un-cluster-de-raspberry-pi?utm_source=chatgpt.com)
- [Infrastructure de cluster informatique avec Raspberry Pi](https://www.raspberrypi-france.fr/infrastructure-de-cluster-informatique-avec-raspberry-pi-elements-de-base-et-deploiement/?utm_source=chatgpt.com)
- [Etude, conception et implémentation d'un cluster low-cost haut disponibilité de Raspberry Pi 3](https://www.memoireonline.com/01/20/11481/Etude-conception-et-implementation-d-un-cluster-low-cost-haut-disponibilite-de-Raspberry-Pi-3.html?utm_source=chatgpt.com)

### **Architecture Logique**

L’architecture logique est structurée pour répondre aux besoins de modularité et de scalabilité grâce à l’utilisation de microservices.

#### **Composants principaux :**

1. **Frontend (Phaser.js)** :
    - Fournit une interface utilisateur immersive en 2D.
    - Gère les interactions en temps réel avec l'univers numérique.
    - Se connecte au backend via des API REST.
2. **Backend (Node.js, Microservices)** :
    - **User Service** : Gestion des informations utilisateur.
    - **Appearance Service** : Gestion des apparences des personnages.
    - **Map Service** : Gestion des cartes interactives et des objets.
    - **Building Service** : Gestion des bâtiments et des interactions.
    - **Document Service** : Stockage et gestion des documents.
    - **Chat Service** : Communication en temps réel via WebSocket.
    - **Story Service** : Gestion du fil conducteur narratif, des quêtes et des dialogues.
    - **Inventory Service** : Gestion des inventaires et des objets.
    - **Notification Service** : Envoi de notifications aux utilisateurs.
    - **Auth Service** : Authentification et autorisation des utilisateurs.
    - **Gateway Service** : Routage des requêtes vers les microservices appropriés.
    - Chaque microservice est conteneurisé pour garantir l’isolation et la facilité de déploiement.
3. **Base de Données (PostgreSQL)** :
    - Stocke les données relationnelles : utilisateurs, cartes, objets, et messages.
    - Fournit une infrastructure robuste pour des relations complexes et des requêtes rapides.
4. **Monitoring (Prometheus, Grafana)** :
    - Collecte des métriques sur l’utilisation du CPU, de la RAM, et des ressources réseau.
    - Affiche des tableaux de bord pour suivre les performances et détecter les anomalies.

#### **Diagramme des Composants Logiques**

![Architecture Logique](/img/doc/Diagramme_Composants.png)

## **Composants de l'Architecture**

### **Frontend**

Le frontend constitue l’interface utilisateur interactive permettant aux étudiants d’explorer l’univers immersif en 2D.

- **Technologie** : Développé avec Phaser.js, un framework optimisé pour les jeux 2D.
- **Rôles et Responsabilités** :
  - Afficher les cartes, PNJ, et objets interactifs.
  - Gérer les interactions utilisateur, y compris les mouvements et les actions.
  - Communiquer avec le backend via des API REST pour récupérer et envoyer des données.
- **Structure du code** :
  - **Scenes** : Gestion des différentes scènes (menu principal, cartes).
  - **Objects** : Définition des objets interactifs tels que les joueurs, PNJ, et items.
  - **Utils** : Fonctions utilitaires pour les collisions, événements, et autres.

### **Backend**

Le backend est structuré en microservices conteneurisés, chacun responsable d’une partie spécifique de la logique métier.

#### **User Service**

- **Responsabilités** :
  - Gestion des utilisateurs (authentification, profils, permissions).
  - API REST pour créer, lire, mettre à jour et supprimer les utilisateurs.
- **Endpoints principaux** :
  - `POST /api/register` : Inscription d’un utilisateur.
  - `POST /api/login` : Connexion d’un utilisateur.
  - `GET /api/profile/:id` : Récupérer le profil d’un utilisateur.

#### **Map Service**

- **Responsabilités** :
  - Gestion des données des cartes (tuiles, objets interactifs, zones).
  - API REST pour récupérer ou mettre à jour les cartes.
- **Endpoints principaux** :
  - `GET /api/maps/:id` : Charger une carte spécifique.
  - `POST /api/maps` : Ajouter une nouvelle carte.

#### **Chat Service**

- **Responsabilités** :
  - Gestion de la communication en temps réel entre utilisateurs.
  - Synchronisation des messages via WebSocket.
- **Endpoints principaux** :
  - WebSocket : Envoyer et recevoir des messages.
  - `GET /api/chat/history` : Récupérer l’historique des discussions.

### **Base de Données**

Le système repose sur PostgreSQL, une base de données relationnelle robuste et performante.

- **Rôles et Responsabilités** :
  - Stockage des données relationnelles : utilisateurs, cartes, messages, objets interactifs.
  - Gestion des relations complexes, telles que les connexions utilisateur-carte ou les interactions utilisateur-message.
- **Schéma des Données** :
  - **users** : Table des utilisateurs (id, nom, email, mot de passe hashé).
  - **maps** : Table des cartes (id, nom, données des tuiles).
  - **messages** : Table des messages (id, contenu, utilisateur, timestamp).

### **Monitoring**

Les outils de monitoring assurent la surveillance et la stabilité de l’ensemble du système.

- **Prometheus** :
  - Collecte des métriques système (utilisation CPU/RAM, latence réseau).
- **Grafana** :
  - Visualisation des métriques et création d’alertes en cas d’anomalies.

## **Orchestration et Déploiement**

### **Conteneurisation**

L’ensemble des services de l’application est conteneurisé à l’aide de Docker, permettant d’isoler les dépendances et de simplifier le déploiement.

#### **Pourquoi Docker ?**

- Isolation des environnements pour chaque service (frontend, backend, base de données).
- Réduction des conflits de dépendances entre les services.
- Simplification du processus de développement, de test et de déploiement.

#### **Structure des Conteneurs**

- **Frontend** :
  - Serveur Nginx hébergeant l’application Phaser.js.
  - Image légère (ex. `nginx:alpine`).
- **Backend** :
  - Chaque microservice backend est déployé dans un conteneur Docker distinct.
  - Images basées sur `node:alpine` pour minimiser la taille.
- **Base de données** :
  - Conteneur PostgreSQL pour gérer le stockage des données relationnelles.
- **Monitoring** :
  - Prometheus et Grafana déployés en conteneurs séparés pour la collecte et la visualisation des métriques.

### **Orchestration**

Pour coordonner les conteneurs et assurer la scalabilité, deux approches sont envisagées selon l’environnement :

#### **Développement Local : Docker Compose**

- **Pourquoi Docker Compose ?**
  - Simple à utiliser pour gérer plusieurs conteneurs en local.
  - Permet de définir les relations entre les services dans un fichier unique (`docker-compose.yml`).

#### **Production : Kubernetes (K3s)**

- **Pourquoi Kubernetes (K3s) ?**
  - Version légère de Kubernetes, adaptée aux ressources limitées des Raspberry Pi.
  - Gestion automatique des déploiements, équilibrage de charge et tolérance aux pannes.
- **Processus de Déploiement** :
    1. Installer K3s sur le master node du cluster Raspberry Pi.
    2. Ajouter les worker nodes au cluster avec `k3s join`.
    3. Déployer les services à l’aide de fichiers manifestes YAML.

### **Déploiement sur Raspberry Pi**

#### **Préparation du Cluster**

1. **Configuration des Raspberry Pi** :
    - Installer un OS léger comme Raspberry Pi OS Lite.
    - Mettre à jour le système avec `apt-get update && apt-get upgrade`.
2. **Installation de Docker** :
    - Utiliser `curl -fsSL https://get.docker.com | sh` pour installer Docker.
3. **Installation de K3s** (optionnel pour l’orchestration) :
    - Exécuter la commande `curl -sfL https://get.k3s.io | sh`.

#### **Déploiement des Services**

- **Avec Docker Compose** :
  - Copier le fichier `docker-compose.yml` sur le master node.
  - Lancer les services avec `docker-compose up -d`.
- **Avec K3s** :
  - Appliquer les manifestes Kubernetes :

```bash
`kubectl apply -f backend-deployment.yml`
```

### **Monitoring du cluster**

Les outils de monitoring garantissent la stabilité et la performance du cluster.

- **Prometheus** :
  - Collecte des métriques sur les conteneurs et les Raspberry Pi.
  - Exemple : utilisation CPU, mémoire, et réseau.
- **Grafana** :
  - Création de tableaux de bord pour visualiser les métriques.
  - Configuration d’alertes en cas d’anomalies.

## **Flux de Données**

Cette section décrit les interactions entre les différents composants du système, les protocoles utilisés, et les données échangées. Une attention particulière est portée sur les flux critiques pour garantir la performance et la cohérence des données.

### **Vue Générale des Flux**

Le système repose sur trois types principaux de flux de données :

1. **Frontend ↔ Backend** : Interaction utilisateur via des API REST pour les requêtes synchrones.
2. **Backend ↔ Base de Données** : Requêtes SQL pour gérer les données relationnelles.
3. **Communication Temps Réel** : WebSocket pour les mises à jour instantanées, comme le chat.

### **Frontend ↔ Backend**

Le frontend (Phaser.js) communique avec les microservices backend pour récupérer ou envoyer des données nécessaires à l’expérience utilisateur.

#### **Protocole**

- **REST API** : Pour les requêtes synchrones.
- **Format de Données** : JSON pour toutes les requêtes et réponses.

#### **Exemples de Requêtes**

- **Requête GET pour charger une carte** :

```http
GET /api/maps/123 
Response:  
{   
    "id": "123",   
    "name": "Campus",   
    "tiles": [[0, 1, 0], [1, 0, 1]] 
}
```

- **Requête POST pour enregistrer un utilisateur** :

```http
POST /api/register 
Body:  
{   
    "username": "artiste01",   
    "email": "artiste@example.com",   
    "password": "hashedPassword" 
}
```

**Rôles et Flux**:

1. Le frontend envoie une requête pour obtenir ou envoyer des données spécifiques.
2. Le backend route la requête vers le service approprié (ex. : Map Service, User Service).
3. Une réponse est renvoyée au frontend, qui met à jour l’interface utilisateur.

### **Backend ↔ Base de Données**

Le backend utilise PostgreSQL pour stocker et gérer les données nécessaires à l'application.

**Protocole**:

- **SQL** : Langage de requête standard pour manipuler les données.
- **Connexion** : Accès direct à la base de données via un driver PostgreSQL (ex. `pg` en Node.js).

#### **Exemples de Requêtes SQL**

- **Insertion d’un utilisateur** :

```sql
INSERT INTO users (id, username, email, password_hash)  
VALUES (1, 'artiste01', 'artiste@example.com', 'hashedPassword');
```

- **Requête pour récupérer les données d’une carte** :

```sql
SELECT * FROM maps WHERE id = '123';
```

**Rôles et Flux**:

1. Le backend exécute une requête SQL en réponse à une demande du frontend.
2. La base de données renvoie les résultats (par ex., données utilisateur ou cartes).
3. Les données sont transformées au format JSON avant d’être envoyées au frontend.

### **Communication Temps Réel**

Certaines interactions nécessitent des mises à jour instantanées entre les utilisateurs, comme le chat ou les actions synchronisées.

**Protocole**:

- **WebSocket** : Permet des communications bidirectionnelles en temps réel.
- **Format de Données** : JSON.

**Exemples de Messages WebSocket**:

- **Message envoyé par un utilisateur** :

```json
{   
    "type": "message",   
    "content": "Bonjour tout le monde !",   
    "senderId": 123,   
    "timestamp": "2024-12-05T10:00:00Z" 
}
```

- **Message de mise à jour reçu par les utilisateurs connectés** :

```json
{   
    "type": "update",   
    "content": "Nouveau message dans le chat !",   
    "senderId": 123,   
    "timestamp": "2024-12-05T10:00:01Z" 
}
```

**Rôles et Flux**:

1. Un utilisateur envoie un message ou effectue une action via le frontend.
2. Le Chat Service transmet l’événement à tous les utilisateurs connectés via WebSocket.
3. Le frontend met immédiatement à jour l’interface utilisateur.

### **Sécurisation des Flux de Données**

Pour protéger les données échangées et garantir leur intégrité :

- **TLS (Transport Layer Security)** : Chiffrement de toutes les communications REST et WebSocket.
- **Authentification** :
  - Utilisation de tokens JWT pour authentifier les requêtes backend.
  - Limitation des connexions WebSocket aux utilisateurs authentifiés.
- **Validation des Données** :
  - Toutes les requêtes sont validées côté backend pour éviter les injections SQL et autres attaques.

### **Diagramme des Flux**

Un diagramme illustre les échanges entre :

- Frontend et backend (via REST API).
- Backend et base de données (via SQL).
- Temps réel avec WebSocket.

## **Sécurité**

La sécurité est une composante essentielle de l'architecture, garantissant la confidentialité, l'intégrité, et la disponibilité des données tout en protégeant le système contre les menaces internes et externes. Cette section détaille les stratégies et les mécanismes de sécurité mis en place.

### **Sécurisation du Réseau**

#### **Chiffrement des Communications**

- Toutes les communications entre les composants (frontend, backend, base de données) utilisent **TLS (Transport Layer Security)**.
- Utilisation de certificats SSL/TLS pour sécuriser :
  - Les API REST.
  - Les connexions WebSocket.
  - Les transferts de fichiers via le stockage partagé (NFS, GlusterFS).

#### **Configuration Réseau**

- **Pare-feu** :
  - Blocage des ports inutilisés à l'aide d’outils comme `iptables` ou `ufw`.
  - Limitation des connexions entrantes au cluster uniquement via des ports spécifiquement autorisés (ex. : 80, 443 pour HTTP/HTTPS).
- **VPN (Virtual Private Network)** :
  - Implémentation d’un serveur VPN (ex. WireGuard) pour l'accès externe sécurisé.
  - Restriction des connexions SSH aux IP approuvées via une configuration stricte.

### **Sécurisation des Services**

#### **Authentification et Autorisation**

- **Authentification des Utilisateurs** :
  - Utilisation de tokens JWT (JSON Web Tokens) pour sécuriser les sessions utilisateur.
  - Expiration automatique des tokens pour limiter les risques d’exploitation.
- **Autorisation** :
  - Mise en place de rôles et permissions pour restreindre l'accès aux données sensibles.
  - Validation côté serveur pour éviter les abus des API.

#### **Protection des API**

- **Validation des Données Entrantes** :
  - Vérification systématique des données reçues pour prévenir les injections SQL ou XSS.
  - Utilisation de bibliothèques comme `express-validator` pour Node.js.
- **Rate Limiting** :
  - Limitation du nombre de requêtes par utilisateur pour éviter les attaques par déni de service (DoS).
  - Implémentation avec des outils comme `express-rate-limit`.

### **Sécurisation de la Base de Données**

- **Authentification Forte** :
  - Utilisation d’identifiants forts pour les connexions au PostgreSQL.
  - Séparation des privilèges d’accès pour limiter les risques en cas de compromission.
- **Chiffrement des Données** :
  - Chiffrement des données sensibles comme les mots de passe (via bcrypt).
  - Option de chiffrement des fichiers pour le stockage partagé.
- **Sauvegardes** :
  - Sauvegardes régulières de la base de données sur un stockage sécurisé.
  - Tests fréquents des processus de restauration.

### **Surveillance et Prévention**

#### **Surveillance par Monitoring**

- **Prometheus** :
  - Surveillance des métriques réseau, CPU, RAM pour détecter les anomalies.
- **Grafana** :
  - Configuration d’alertes pour notifier les administrateurs en cas de dépassement de seuils critiques.

#### **Prévention des Intrusions**

- **Outils Anti-Intrusion** :
  - Installation de Fail2Ban pour surveiller et bloquer les tentatives de connexion non autorisées.
- **Journalisation** :
  - Maintien de logs détaillés des accès et événements critiques.
  - Analyse régulière des logs pour identifier des comportements suspects.

### **Plan de Réponse aux Incidents**

En cas d'incident (ex. : attaque, panne) :

1. **Détection** : Alertes configurées via Grafana.
2. **Isolation** : Isolement des composants affectés pour éviter la propagation.
3. **Restauration** : Utilisation des sauvegardes pour restaurer les données.
4. **Analyse Post-Incident** : Enquête pour identifier la cause et renforcer les mesures.
