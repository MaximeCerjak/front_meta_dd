
# Architecture Logique

L'architecture logique du projet repose sur une organisation modulaire et évolutive grâce à l'utilisation des microservices. Cette structure garantit la scalabilité, la maintenance et la répartition claire des responsabilités entre les différents composants logiciels.

## **Composants Principaux**

### **Frontend**

Le frontend constitue l’interface utilisateur immersive, développée avec Phaser.js, un framework optimisé pour les jeux 2D.

- **Rôles principaux** :
  - Afficher les cartes, PNJ, et objets interactifs.
  - Gérer les interactions utilisateur (mouvements, actions).
  - Communiquer avec le backend via des API REST et WebSocket.
- **Structure du code** :
  - **Scenes** : Gestion des différentes scènes (menu principal, cartes, interfaces).
  - **Objects** : Définition des objets interactifs comme les joueurs, PNJ, et items.
  - **Utils** : Fonctions utilitaires pour les collisions, événements, etc.

### **Backend**

Le backend est organisé en microservices conteneurisés pour garantir l’isolation des fonctionnalités et simplifier le déploiement.

#### **Liste des Microservices :**

1. **User Service** :
    - Gestion des utilisateurs (authentification, profils, permissions).
    - API pour la création, la récupération, la mise à jour, et la suppression des données utilisateur.
2. **Appearance Service** :
    - Gestion des avatars et de la personnalisation des personnages.
3. **Map Service** :
    - Gestion des cartes interactives, tuiles, zones traversables, et objets.
4. **Building Service** :
    - Gestion des bâtiments, de leur placement et des interactions associées.
5. **Document Service** :
    - Gestion des fichiers d’exposition (images, vidéos, 3D).
6. **Chat Service** :
    - Communication en temps réel entre les utilisateurs via WebSocket.
7. **Story Service** :
    - Gestion des quêtes narratives et des étapes liées aux interactions.
8. **Inventory Service** :
    - Gestion des objets possédés par les utilisateurs.
9. **Notification Service** :
    - Envoi de notifications temps réel ou différées.
10. **Auth Service** :
    - Authentification sécurisée des utilisateurs via JWT.
11. **Gateway Service** :
    - Routage des requêtes vers les microservices appropriés.

#### **Diagramme des Composants Logiques**

Le diagramme ci-dessous illustre l’organisation des composants logiciels et leurs interactions :

![Diagramme des Composants Logiques](/img/doc/Diagramme_logic.png)

### **Base de Données**

La base de données relationnelle PostgreSQL est utilisée pour stocker et gérer les données nécessaires à l'application.

#### **Diagramme de classes**

![Diagramme de classes](/img/doc/Diagramme_Classes_v2.png)

#### **Classes**

![Modèle de Données](/img/doc/data_model.png)

- **Tables principales :**
  - **users** : Données utilisateur (id, nom, email, mot de passe hashé).
  - **maps** : Cartes interactives (id, nom, données des tuiles).
  - **buildings** : Données sur les bâtiments (id, position, contenu).
  - **documents** : Fichiers téléversés (id, type, URL).
  - **inventory** : Objets possédés par les utilisateurs.
  - **story** : Quêtes narratives et progression.
  - **chat** : Canal d'échange pour les messages en temps réel.

## **Avantages de l'Architecture Microservices**

**Modularité** : Chaque microservice est indépendant, ce qui facilite les mises à jour et les corrections de bugs.

**Scalabilité** : Les services critiques peuvent être répliqués en cas de montée en charge.

**Facilité de Maintenance** : Une séparation claire des responsabilités simplifie le développement et la gestion.
