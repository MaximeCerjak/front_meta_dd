# MVP

Le projet vise à créer une plateforme immersive 2D où les utilisateurs peuvent explorer un univers interactif, échanger des messages en temps réel, sotcker des fichiers, organiser des expositions et personaliser leur environnement. Cela se déroulerait dans un cadre orienté rpg et soutenu par une narration mélant découverte et énigme. Cependant, compte tenu des contraintes de temps et des ressources disponibles, un **MVP (Minimum Viable Product)** a été défini pour répondre à des objectifs essentiels tout en réduisant la charge de travail initiale.

Ce document présente le MVP, son périmètre fonctionnel, et la réflexion ayant conduit à limiter les fonctionnalités tout en maintenant l'essence du projet.

## **Objectifs Réduits pour le MVP**

### **Objectifs du projet initial**

Le projet complet vise à offrir :

1. Un univers complexe où les utilisateurs peuvent explorer et interagir avec des cartes et des objets enrichis.
2. Une gestion fine des expositions d'oeuvres ou représentations numériques dans un environnement distribué.
3. Des fonctionnalités sociales avancées, notamment la collaboration entre utilisateurs.
4. Une expérience immersive et narrative soutenue par des éléments de jeu de rôle.
5. Une personnalisation poussée de l'environnement et des interactions, nottament la possibilité de travailler en collaboration sur des projets artistiques.

### **Réflexion sur le MVP**

Pour maximiser les chances de succès dans le cadre d'un travail réalisé principalement sur mon temps libre, les objectifs ont été recentrés sur :

1. **Interactions de base** : Permettre à plusieurs utilisateurs de se connecter, se déplacer sur une carte et interagir avec des objets simples.
2. **Partage de fichiers minimaliste** : Uploader des fichiers et les lier à des objets interactifs sur une carte.
3. **Messages en temps réel** : Échanger via un système de chat lié à des groupes ou sessions spécifiques.
4. **Cartes simplifiées** : Représentation d'une carte par une image associée à une grille logique (`grid`) pour gérer les zones passables, bloquantes et interactives.

## **Description du MVP**

### **Fonctionnalités Principales**

**Rencontres en Ligne** :

    - Plusieurs utilisateurs peuvent se connecter en même temps et voir leurs avatars respectifs.
    - Déplacement en temps réel sur une carte avec gestion des collisions via la grille logique (`grid`).

**Partage de Fichiers** :

    - Les utilisateurs peuvent uploader un fichier et le lier à un objet (ex. une stèle).
    - Ces fichiers sont accessibles en interagissant avec les objets sur la carte.

**Messagerie** :

    - Système de chat en temps réel entre les utilisateurs.
    - Gestion des chats organisés par groupe (`Chat`).

**Cartes et Objets** :

    - Les cartes sont définies par une image de fond et une grille logique pour les zones passables, bloquantes, ou transportantes.
    - Les objets interactifs peuvent avoir une grille locale pour représenter des éléments comme des portes dans un bâtiment.

## **Architecture du MVP**

### **Diagramme des Composants**

L'architecture logicielle est basée sur une séparation claire des responsabilités grâce à une architecture microservices, dans le cadre du MVP les services développés ont été réduits pour répondre aux besoins essentiels.

![Diagramme des Composants](/img/doc/MVP_Components_Diagram.png)

#### **Description des Composants**

**Frontend** : Application client développée avec Phaser.js pour gérer l'univers 2D.

**Gateway Service** : Route les requêtes vers les microservices appropriés.

**Microservices Backend** :
    - **User Service** : Gestion des utilisateurs (authentification, gestion des profils).
    - **Map Service** : Chargement des cartes et gestion des objets interactifs.
    - **Chat Service** : Gestion des messages en temps réel via WebSocket. WebRTC
    - **Document Service** : Gestion des fichiers uploadés par les utilisateurs.
    zeroMQ

**Database (PostgreSQL)** : Stocke les utilisateurs, cartes, objets, fichiers et messages.

### **Modèle de Données**

Le modèle de données a été conçu pour représenter les entités principales et leurs relations dans le système.

![Modèle de Données](/img/doc/MVP_Class_Diagram.png)

#### **Principales Entités**

**User** : Gère les informations des utilisateurs : `id`, `name`, `email`, `roles`, etc.

**Map** : Définit une carte par une image de fond et une grille logique (`grid`).

**Object** : Représente des éléments interactifs dans une carte, avec une grille locale pour des structures complexes.

**Document** : Permet aux utilisateurs d’associer des fichiers à des objets sur la carte.

**Chat** : Organise les discussions en temps réel entre utilisateurs.

**Message** : Stocke les messages échangés, liés à un chat et à un utilisateur.

## **Limites du MVP**

1. **Fonctionnalités Réduites** :

    - Les fonctionnalités d’expositions collaboratives et narratives ne sont pas incluses.
    - Les cartes restent simples, sans gestion avancée des PNJ ou événements dynamiques.

2. **Expérience Utilisateur Minimaliste** :

    - L’interface pour gérer les interactions et les objets est volontairement simplifiée.
    - Les avatars et les interactions sont limités pour réduire la complexité.
    - Les fonctionnalités sociales sont basiques, sans gestion avancée des groupes ou des permissions.
    - Les interactions avec les objets sont limitées à l’upload de fichiers et à la visualisation.

3. **Absence de Sécurisation Avancée** :

    - Les mesures de sécurité comme le chiffrement avancé ou le contrôle d'accès granulaire sont repoussées à une version ultérieure.
