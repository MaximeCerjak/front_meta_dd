// src/game/services/WebSocketChatService.js
import { EventBus } from '../EventBus';

/**
 * Service de simulation WebSocket pour le chat entre joueurs
 * Simule une connexion WebSocket avec des joueurs fictifs
 */
export default class WebSocketChatService {
    constructor() {
        this.isConnected = false;
        this.currentUser = null;
        this.connectedPlayers = [];
        this.messageHistory = [];
        this.simulationInterval = null;
        this.botMessages = [
            "Salut ! Quelqu'un a vu la nouvelle exposition ?",
            "Cette œuvre de Van Gogh est magnifique !",
            "Est-ce que quelqu'un peut m'aider à trouver la salle Renaissance ?",
            "J'adore cette visite virtuelle du musée !",
            "Wow, cette sculpture interactive est incroyable",
            "Qui veut explorer la galerie moderne ensemble ?",
            "Cette peinture me rappelle mes cours d'art",
            "Le guide audio est vraiment bien fait",
            "Quelqu'un connaît l'histoire de ce tableau ?",
            "Cette exposition temporaire vaut vraiment le détour !",
            "Les détails de cette fresque sont saisissants",
            "Merci pour l'explication, très intéressant !",
            "Je recommande vraiment cette section égyptienne",
            "Cette reconstitution 3D est bluffante"
        ];
        
        // Joueurs fictifs pour la simulation
        this.fakePlayers = [
            { id: 'alice_123', username: 'Alice', avatar: '🎨', status: 'online', scene: 'Museumreception' },
            { id: 'bob_456', username: 'Bob', avatar: '🖼️', status: 'online', scene: 'Exhibitionroom' },
            { id: 'charlie_789', username: 'Charlie', avatar: '🏛️', status: 'online', scene: 'Welcomeisle' },
            { id: 'diana_012', username: 'Diana', avatar: '🎭', status: 'online', scene: 'Intro' },
            { id: 'eve_345', username: 'Eve', avatar: '🖌️', status: 'online', scene: 'Sandbox' }
        ];

        this.initializeService();
    }

    /**
     * Initialise le service et simule la connexion
     */
    initializeService() {
        // Simuler un utilisateur connecté
        this.currentUser = {
            id: 'user_' + Date.now(),
            username: localStorage.getItem('username') || 'Joueur',
            avatar: '🧝',
            status: 'online',
            scene: 'Intro'
        };

        console.log('WebSocketChatService - Initialisation avec utilisateur:', this.currentUser);
    }

    /**
     * Simule la connexion WebSocket
     */
    connect() {
        return new Promise((resolve) => {
            console.log('WebSocketChatService - Connexion en cours...');
            
            // Simuler un délai de connexion
            setTimeout(() => {
                this.isConnected = true;
                this.connectedPlayers = [...this.fakePlayers];
                
                // Ajouter l'utilisateur actuel à la liste
                this.connectedPlayers.push(this.currentUser);
                
                console.log('WebSocketChatService - Connecté avec succès');
                console.log('Joueurs connectés:', this.connectedPlayers);
                
                // Démarrer la simulation de messages automatiques
                this.startMessageSimulation();
                
                // Émettre l'événement de connexion
                EventBus.emit('websocket-connected', {
                    connectedPlayers: this.connectedPlayers,
                    currentUser: this.currentUser
                });
                
                resolve(true);
            }, 1000);
        });
    }

    /**
     * Simule la déconnexion WebSocket
     */
    disconnect() {
        this.isConnected = false;
        this.stopMessageSimulation();
        this.connectedPlayers = [];
        
        EventBus.emit('websocket-disconnected');
        console.log('WebSocketChatService - Déconnecté');
    }

    /**
     * Envoie un message (simulation)
     */
    sendMessage(content, type = 'global') {
        if (!this.isConnected) {
            console.warn('Pas connecté au WebSocket');
            return false;
        }

        const message = {
            id: 'msg_' + Date.now(),
            senderId: this.currentUser.id,
            senderName: this.currentUser.username,
            senderAvatar: this.currentUser.avatar,
            content: content.trim(),
            type, // 'global', 'scene', 'private'
            scene: this.currentUser.scene,
            timestamp: new Date().toISOString(),
            isOwn: true
        };

        // Ajouter à l'historique
        this.messageHistory.push(message);

        // Émettre le message immédiatement
        EventBus.emit('websocket-message-received', message);

        console.log('Message envoyé:', message);

        // Simuler une réponse aléatoire après un délai
        this.simulateResponse(message);

        return true;
    }

    /**
     * Simule une réponse d'un autre joueur
     */
    simulateResponse(originalMessage) {
        // 70% de chance d'avoir une réponse
        if (Math.random() > 0.3) {
            const randomPlayer = this.fakePlayers[Math.floor(Math.random() * this.fakePlayers.length)];
            
            setTimeout(() => {
                const response = {
                    id: 'msg_' + Date.now(),
                    senderId: randomPlayer.id,
                    senderName: randomPlayer.username,
                    senderAvatar: randomPlayer.avatar,
                    content: this.generateContextualResponse(originalMessage.content),
                    type: originalMessage.type,
                    scene: originalMessage.scene,
                    timestamp: new Date().toISOString(),
                    isOwn: false
                };

                this.messageHistory.push(response);
                EventBus.emit('websocket-message-received', response);
            }, Math.random() * 3000 + 1000); // 1-4 secondes
        }
    }

    /**
     * Génère une réponse contextuelle
     */
    generateContextualResponse(originalContent) {
        const responses = [
            "Tout à fait d'accord !",
            "Intéressant point de vue 🤔",
            "Merci pour l'info !",
            "Je vais aller voir ça",
            "Excellente question",
            "Ça me donne envie d'en savoir plus",
            "Très belle découverte !",
            "Je pense la même chose",
            "Bonne suggestion 👍",
            "Merci du partage !"
        ];

        // Réponses spécifiques selon le contenu
        const lowerContent = originalContent.toLowerCase();
        
        if (lowerContent.includes('bonjour') || lowerContent.includes('salut')) {
            return Math.random() > 0.5 ? 'Salut ! Bienvenue 👋' : 'Bonjour ! Content de te voir ici';
        }
        
        if (lowerContent.includes('aide') || lowerContent.includes('?')) {
            return Math.random() > 0.5 ? 'Je peux t\'aider si tu veux' : 'Quelle est ta question exactement ?';
        }
        
        if (lowerContent.includes('merci')) {
            return Math.random() > 0.5 ? 'De rien ! 😊' : 'Avec plaisir !';
        }

        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * Démarre la simulation de messages automatiques
     */
    startMessageSimulation() {
        this.simulationInterval = setInterval(() => {
            // 30% de chance d'avoir un message automatique toutes les 10-20 secondes
            if (Math.random() > 0.7) {
                this.simulateRandomMessage();
            }
        }, Math.random() * 10000 + 10000); // 10-20 secondes
    }

    /**
     * Arrête la simulation de messages automatiques
     */
    stopMessageSimulation() {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
    }

    /**
     * Simule un message aléatoire d'un joueur fictif
     */
    simulateRandomMessage() {
        const randomPlayer = this.fakePlayers[Math.floor(Math.random() * this.fakePlayers.length)];
        const randomMessage = this.botMessages[Math.floor(Math.random() * this.botMessages.length)];

        const message = {
            id: 'msg_' + Date.now(),
            senderId: randomPlayer.id,
            senderName: randomPlayer.username,
            senderAvatar: randomPlayer.avatar,
            content: randomMessage,
            type: 'global',
            scene: randomPlayer.scene,
            timestamp: new Date().toISOString(),
            isOwn: false
        };

        this.messageHistory.push(message);
        EventBus.emit('websocket-message-received', message);
    }

    /**
     * Met à jour la scène actuelle de l'utilisateur
     */
    updateUserScene(sceneKey) {
        if (this.currentUser) {
            this.currentUser.scene = sceneKey;
            
            // Émettre la mise à jour
            EventBus.emit('websocket-user-scene-changed', {
                userId: this.currentUser.id,
                scene: sceneKey
            });
        }
    }

    /**
     * Récupère la liste des joueurs connectés
     */
    getConnectedPlayers() {
        return this.connectedPlayers;
    }

    /**
     * Récupère l'historique des messages
     */
    getMessageHistory(limit = 50) {
        return this.messageHistory.slice(-limit);
    }

    /**
     * Récupère les joueurs dans la même scène
     */
    getPlayersInScene(sceneKey) {
        return this.connectedPlayers.filter(player => player.scene === sceneKey);
    }

    /**
     * Vérifie l'état de la connexion
     */
    isWebSocketConnected() {
        return this.isConnected;
    }

    /**
     * Change le statut de l'utilisateur
     */
    updateUserStatus(status) {
        if (this.currentUser) {
            this.currentUser.status = status;
            
            EventBus.emit('websocket-user-status-changed', {
                userId: this.currentUser.id,
                status: status
            });
        }
    }

    /**
     * Nettoie le service
     */
    destroy() {
        this.disconnect();
        this.messageHistory = [];
        this.connectedPlayers = [];
        this.currentUser = null;
    }
}