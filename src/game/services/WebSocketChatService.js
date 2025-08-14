// src/game/services/WebSocketChatService.js - VERSION AVEC IA
import { EventBus } from '../EventBus';
import ApiManager from '../../api/ApiManager';

/**
 * Service de simulation WebSocket pour le chat entre joueurs
 * Utilise l'IA pour générer des conversations naturelles
 */
export default class WebSocketChatService {
    constructor() {
        this.isConnected = false;
        this.currentUser = null;
        this.connectedPlayers = [];
        this.messageHistory = [];
        this.simulationInterval = null;
        this.responseTimeout = null;
        
        // Joueurs fictifs (seront remplacés par les données du backend)
        this.virtualPlayers = [];
    }

    /**
     * Initialise le service et simule la connexion
     */
    async connect() {
        return new Promise(async (resolve) => {
            console.log('WebSocketChatService - Connexion en cours...');
            
            try {
                // Récupérer les joueurs virtuels depuis le backend
                const playersData = await ApiManager.getVirtualPlayers();
                this.virtualPlayers = playersData.players;
                console.log('Joueurs virtuels chargés:', this.virtualPlayers);
            } catch (error) {
                console.warn('Impossible de charger les joueurs virtuels, utilisation des données par défaut');
                // Fallback avec joueurs par défaut
                this.virtualPlayers = [
                    { id: 'alice', name: 'Alice', avatar: '🎨', status: 'online', scene: 'Museumreception' },
                    { id: 'bob', name: 'Bob', avatar: '🖼️', status: 'online', scene: 'Exhibitionroom' },
                    { id: 'charlie', name: 'Charlie', avatar: '🏛️', status: 'online', scene: 'Welcomeisle' },
                    { id: 'diana', name: 'Diana', avatar: '🎭', status: 'online', scene: 'Intro' },
                    { id: 'eve', name: 'Eve', avatar: '🖌️', status: 'online', scene: 'Sandbox' }
                ];
            }
            
            // Simuler un délai de connexion
            setTimeout(() => {
                this.isConnected = true;
                this.connectedPlayers = [...this.virtualPlayers];
                
                // Ajouter l'utilisateur actuel à la liste
                this.currentUser = {
                    id: 'user_' + Date.now(),
                    username: localStorage.getItem('username') || 'Joueur',
                    avatar: '🧝',
                    status: 'online',
                    scene: 'Intro'
                };
                this.connectedPlayers.push(this.currentUser);
                
                console.log('WebSocketChatService - Connecté avec succès');
                console.log('Joueurs connectés:', this.connectedPlayers);
                
                // Démarrer la simulation de messages automatiques avec IA
                this.startAIMessageSimulation();
                
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
        this.stopAIMessageSimulation();
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

        // Simuler une réponse avec IA après un délai
        this.simulateAIResponse(message);

        return true;
    }

    /**
     * Démarre la simulation de messages automatiques avec IA
     */
    startAIMessageSimulation() {
        console.log('WebSocketChatService - Démarrage simulation IA');
        
        // Premier message après 3 secondes
        setTimeout(() => {
            if (this.isConnected) {
                this.generateSpontaneousMessage();
            }
        }, 3000);

        // Messages spontanés périodiques (toutes les 20-40 secondes)
        this.simulationInterval = setInterval(() => {
            if (this.isConnected && Math.random() > 0.4) { // 60% de chance
                this.generateSpontaneousMessage();
            }
        }, 20000 + Math.random() * 20000); // 20-40 secondes
    }

    /**
     * Arrête la simulation de messages automatiques
     */
    stopAIMessageSimulation() {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
        if (this.responseTimeout) {
            clearTimeout(this.responseTimeout);
            this.responseTimeout = null;
        }
    }

    /**
     * Génère un message spontané via l'IA
     */
    async generateSpontaneousMessage() {
        try {
            console.log('Génération message spontané...');
            const response = await ApiManager.generateSpontaneousMessage();
            
            const message = {
                id: 'ai_spont_' + Date.now(),
                senderId: response.playerId,
                senderName: response.playerName,
                senderAvatar: response.playerAvatar,
                content: response.message,
                type: 'global',
                scene: this.getRandomScene(),
                timestamp: response.timestamp,
                isOwn: false
            };

            this.messageHistory.push(message);
            EventBus.emit('websocket-message-received', message);
            
            console.log('Message spontané IA reçu:', message);
            
        } catch (error) {
            console.error('Erreur génération message spontané:', error);
            // Fallback avec message simple
            this.simulateSimpleMessage();
        }
    }

    /**
     * Simule une réponse avec IA à un message utilisateur
     */
    async simulateAIResponse(originalMessage) {
        // 70% de chance d'avoir une réponse
        if (Math.random() > 0.3) {
            // Délai réaliste de réponse (1-4 secondes)
            const delay = Math.random() * 3000 + 1000;
            
            this.responseTimeout = setTimeout(async () => {
                try {
                    console.log('Génération réponse IA à:', originalMessage.content);
                    
                    // Préparer le contexte de conversation
                    const conversationContext = this.messageHistory.slice(-5).map(msg => ({
                        senderName: msg.senderName,
                        content: msg.content,
                        timestamp: msg.timestamp
                    }));
                    
                    const response = await ApiManager.generateResponseToUserMessage(
                        originalMessage.content, 
                        conversationContext
                    );
                    
                    const replyMessage = {
                        id: 'ai_resp_' + Date.now(),
                        senderId: response.playerId,
                        senderName: response.playerName,
                        senderAvatar: response.playerAvatar,
                        content: response.message,
                        type: originalMessage.type,
                        scene: originalMessage.scene,
                        timestamp: response.timestamp,
                        isOwn: false
                    };

                    this.messageHistory.push(replyMessage);
                    EventBus.emit('websocket-message-received', replyMessage);
                    
                    console.log('Réponse IA reçue:', replyMessage);
                    
                } catch (error) {
                    console.error('Erreur génération réponse IA:', error);
                    // Fallback avec réponse simple
                    this.simulateSimpleResponse(originalMessage);
                }
            }, delay);
        }
    }

    /**
     * Fallback : génère un message simple sans IA
     */
    simulateSimpleMessage() {
        const simpleMessages = [
            "Quelqu'un a des conseils pour la perspective ?",
            "Cette exposition est vraiment inspirante !",
            "J'adore les techniques de cette époque",
            "Comment vous interprétez cette œuvre ?",
            "Les couleurs de cette peinture sont fascinantes"
        ];

        const randomPlayer = this.virtualPlayers[Math.floor(Math.random() * this.virtualPlayers.length)];
        const randomMessage = simpleMessages[Math.floor(Math.random() * simpleMessages.length)];

        const message = {
            id: 'fallback_' + Date.now(),
            senderId: randomPlayer.id,
            senderName: randomPlayer.name,
            senderAvatar: randomPlayer.avatar,
            content: randomMessage,
            type: 'global',
            scene: this.getRandomScene(),
            timestamp: new Date().toISOString(),
            isOwn: false
        };

        this.messageHistory.push(message);
        EventBus.emit('websocket-message-received', message);
    }

    /**
     * Fallback : génère une réponse simple sans IA
     */
    simulateSimpleResponse(originalMessage) {
        const simpleResponses = [
            "Intéressant ! J'aimerais en savoir plus.",
            "Bonne remarque ! Ça me fait réfléchir.",
            "Je vois ce que tu veux dire.",
            "C'est une perspective intéressante !",
            "Merci pour le partage !",
            "Excellente question !",
            "Ça me rappelle quelque chose...",
            "Je suis d'accord avec toi."
        ];

        const randomPlayer = this.virtualPlayers[Math.floor(Math.random() * this.virtualPlayers.length)];
        const randomResponse = simpleResponses[Math.floor(Math.random() * simpleResponses.length)];

        const message = {
            id: 'fallback_resp_' + Date.now(),
            senderId: randomPlayer.id,
            senderName: randomPlayer.name,
            senderAvatar: randomPlayer.avatar,
            content: randomResponse,
            type: originalMessage.type,
            scene: originalMessage.scene,
            timestamp: new Date().toISOString(),
            isOwn: false
        };

        this.messageHistory.push(message);
        EventBus.emit('websocket-message-received', message);
    }

    /**
     * Retourne une scène aléatoire
     */
    getRandomScene() {
        const scenes = ['Intro', 'Welcomeisle', 'Museumreception', 'Exhibitionroom', 'Sandbox'];
        return scenes[Math.floor(Math.random() * scenes.length)];
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
        this.stopAIMessageSimulation();
        this.messageHistory = [];
        this.connectedPlayers = [];
        this.currentUser = null;
        this.isConnected = false;
    }
}