
# Flux de Données

Les flux de données définissent les interactions entre les composants du système, les protocoles utilisés et les données échangées. Ce document détaille les flux critiques, leurs rôles dans l'application, et les mesures de sécurisation associées.

## **1. Vue Générale des Flux**

Le système repose sur trois types principaux de flux de données :

1. **Frontend ↔ Backend** :
    - Interaction utilisateur via des API REST pour les requêtes synchrones.
2. **Backend ↔ Base de Données** :
    - Requêtes SQL pour gérer les données relationnelles.
3. **Communication Temps Réel** :
    - WebSocket pour les mises à jour instantanées, comme le chat.

### **Diagramme des flux de données**

![Diagramme des flux de données](/img/doc/Diagramme_Flux.png)

## **2. Frontend ↔ Backend**

Le frontend (Phaser.js) communique avec les microservices backend pour récupérer ou envoyer des données nécessaires à l’expérience utilisateur.

### **2.1. Protocole**  

- **REST API** : Pour les requêtes synchrones.
- **Format de Données** : JSON pour toutes les requêtes et réponses.

### **2.2. Exemples de Requêtes**

- **Requête GET pour charger une carte** :

    ```http
    GET /api/maps/123 
    Response:  
    {   
        "id": "123",   
        "name": "Campus", 
        "picture": "/.../assets/...",  
        "grid": [[0, 1, 0, 1, 1, 1, 1, 0...]] 
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

### **2.3. Rôles et Flux**

1. Le frontend envoie une requête pour obtenir ou envoyer des données spécifiques.
2. Le backend route la requête vers le service approprié via le Gateway Service (ex. : Map Service, User Service).
3. Une réponse est renvoyée au frontend, qui met à jour l’interface utilisateur.

## **3. Backend ↔ Base de Données**

Le backend utilise PostgreSQL pour stocker et gérer les données nécessaires à l'application.

### **3.1. Protocole**

- **SQL** : Langage de requête standard pour manipuler les données.
- **Connexion** : Accès direct à la base de données via un driver PostgreSQL (ex. `pg` en Node.js).

### **3.2. Exemples de Requêtes SQL**

- **Insertion d’un utilisateur** :

    ```sql
    INSERT INTO users (id, username, email, password_hash)  
    VALUES (1, 'artiste01', 'artiste@example.com', 'hashedPassword');
    ```

- **Requête pour récupérer les données d’une carte** :

    ```sql
    SELECT * FROM maps WHERE id = '123';
    ```

### **3.3. Rôles et Flux**

1. Le backend exécute une requête SQL en réponse à une demande du frontend.
2. La base de données renvoie les résultats (par ex., données utilisateur ou cartes).
3. Les données sont transformées au format JSON avant d’être envoyées au frontend.

## **4. Communication Temps Réel**

Certaines interactions nécessitent des mises à jour instantanées entre les utilisateurs, comme le chat, les actions synchronisées ou les mises à jour de la carte.

### **4.1. Protocole**

- **WebSocket** : Permet des communications bidirectionnelles en temps réel.
- **WebRTC** :  
- **Format de Données** : JSON.

### **4.2. Exemples de Messages WebSocket**

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

### **4.3. Rôles et Flux**

1. Un utilisateur envoie un message ou effectue une action via le frontend.
2. Le Chat Service transmet l’événement à tous les utilisateurs connectés via WebSocket.
3. Le frontend met immédiatement à jour l’interface utilisateur.

## **5. Sécurisation des Flux de Données**

Pour protéger les données échangées et garantir leur intégrité :

- **TLS (Transport Layer Security)** : Chiffrement de toutes les communications REST et WebSocket.
- **Authentification** :
  - Utilisation de tokens JWT pour authentifier les requêtes backend.
  - Limitation des connexions WebSocket aux utilisateurs authentifiés.
- **Validation des Données** :
  - Toutes les requêtes sont validées côté backend pour éviter les injections SQL et autres attaques.
