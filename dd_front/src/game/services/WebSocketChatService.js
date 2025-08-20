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
        this.virtualPlayers = [];
    }

    /**
     * Initialise le service et simule la connexion
     */
    async connect() {
        return new Promise(async (resolve) => {
            console.log('WebSocketChatService - Connexion en cours...');
            
            try {
                const playersData = await ApiManager.getVirtualPlayers();
                this.virtualPlayers = playersData.players;
                console.log('Joueurs virtuels chargés:', this.virtualPlayers);
            } catch (error) {
                console.warn('Impossible de charger les joueurs virtuels, utilisation des données par défaut');
                this.virtualPlayers = [
                    { id: 'alice', name: 'Alice', avatar: '🎨', status: 'online', scene: 'Museumreception' },
                    { id: 'bob', name: 'Bob', avatar: '🖼️', status: 'online', scene: 'Exhibitionroom' },
                    { id: 'charlie', name: 'Charlie', avatar: '🏛️', status: 'online', scene: 'Welcomeisle' },
                    { id: 'diana', name: 'Diana', avatar: '🎭', status: 'online', scene: 'Intro' },
                    { id: 'eve', name: 'Eve', avatar: '🖌️', status: 'online', scene: 'Sandbox' }
                ];
            }
            
            setTimeout(() => {
                this.isConnected = true;
                this.connectedPlayers = [...this.virtualPlayers];
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
                
                this.startAIMessageSimulation();
                
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
            type,
            scene: this.currentUser.scene,
            timestamp: new Date().toISOString(),
            isOwn: true
        };

        this.messageHistory.push(message);

        EventBus.emit('websocket-message-received', message);

        console.log('Message envoyé:', message);

        // Délai avant de générer les réponses IA
        this.simulateAIResponse(message);

        return true;
    }

    /**
     * Démarre la simulation de messages automatiques avec IA
     */
    startAIMessageSimulation() {
        console.log('WebSocketChatService - Démarrage simulation IA');

        setTimeout(() => {
            if (this.isConnected) {
                this.generateSpontaneousMessage();
            }
        }, 3000);

        // Messages spontanés périodiques (toutes les 60-180 secondes)
        this.simulationInterval = setInterval(() => {
            if (this.isConnected && Math.random() > 0.4) { // 60% de chance
                this.generateSpontaneousMessage();
            }
        }, 60000 + Math.random() * 120000); // 60-180 secondes
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
            this.simulateSimpleMessage();
        }
    }

    /**
     * Simule une réponse avec IA à un message utilisateur
     */
    async simulateAIResponse(originalMessage) {
        const shouldRespond = Math.random() > 0.1; // 90% de chance de réponse
        
        if (!shouldRespond) {
            console.log('Aucune réponse générée pour ce message');
            return;
        }

        const delay = Math.random() * 2000 + 1000; // 1-3 secondes
        
        this.responseTimeout = setTimeout(async () => {
            try {
                console.log('Génération réponse IA à :', originalMessage.content);
                
                const conversationContext = this.messageHistory.slice(-5).map(msg => ({
                    senderName: msg.senderName,
                    content: msg.content,
                    timestamp: msg.timestamp
                }));
                
                const apiResponse = await ApiManager.generateResponseToUserMessage(
                    originalMessage.content, 
                    conversationContext
                );
                
                console.log('🔍 Réponse API complète reçue:', apiResponse);
                
                // Validation plus stricte de la réponse
                if (!apiResponse) {
                    throw new Error('Réponse API vide ou null');
                }
                
                let responses = [];
                
                // Gestion des différents formats
                if (apiResponse.responses && Array.isArray(apiResponse.responses) && apiResponse.responses.length > 0) {
                    responses = apiResponse.responses;
                    console.log(`✅ Format standard: ${responses.length} réponse(s) trouvée(s)`);
                } else if (apiResponse.playerId && apiResponse.playerName && apiResponse.message) {
                    // Format ancien direct
                    responses = [apiResponse];
                    console.log('✅ Format legacy: réponse unique convertie');
                } else {
                    // Réponse invalide
                    console.error('❌ Format de réponse invalide:', {
                        hasResponses: !!apiResponse.responses,
                        isArray: Array.isArray(apiResponse.responses),
                        responsesLength: apiResponse.responses?.length,
                        hasPlayerId: !!apiResponse.playerId,
                        hasPlayerName: !!apiResponse.playerName,
                        hasMessage: !!apiResponse.message,
                        actualKeys: Object.keys(apiResponse)
                    });
                    throw new Error('Format de réponse API invalide');
                }
                
                // Traitement des réponses valides
                for (let i = 0; i < responses.length; i++) {
                    const response = responses[i];
                    
                    // Validation de chaque réponse
                    if (!response.playerId || !response.playerName || !response.message) {
                        console.warn('⚠️ Réponse incomplète ignorée:', {
                            hasPlayerId: !!response.playerId,
                            hasPlayerName: !!response.playerName,
                            hasMessage: !!response.message,
                            response: response
                        });
                        continue;
                    }
                    
                    const responseDelay = i > 0 ? Math.random() * 2000 + 500 : 0;
                    
                    setTimeout(() => {
                        const replyMessage = {
                            id: 'ai_resp_' + Date.now() + '_' + i,
                            senderId: response.playerId,
                            senderName: response.playerName,
                            senderAvatar: response.playerAvatar || '🤖',
                            content: response.message,
                            type: originalMessage.type,
                            scene: originalMessage.scene,
                            timestamp: response.timestamp || new Date().toISOString(),
                            isOwn: false
                        };

                        this.messageHistory.push(replyMessage);
                        EventBus.emit('websocket-message-received', replyMessage);
                        
                        console.log(`✅ Réponse IA ${i + 1}/${responses.length} traitée:`, replyMessage);
                    }, responseDelay);
                }
                
                if (responses.length === 0) {
                    throw new Error('Aucune réponse valide dans la réponse API');
                }
                
            } catch (error) {
                console.error('❌ Erreur complète génération réponse IA:', {
                    error: error.message,
                    stack: error.stack,
                    originalMessage: originalMessage.content
                });
                console.log('🔄 Utilisation du fallback...');
                this.simulateSimpleResponse(originalMessage);
            }
        }, delay);
    }

    /**
     * Fallback : génère un message simple sans IA
     */
    simulateSimpleMessage() {
        const simpleMessages = [
            'Quelqu\'un a des conseils pour la perspective ?',
            'Cette zone de la plateforme est vraiment bien conçue !',
            'J\'adore les techniques qu\'on apprend ici',
            'Comment vous vous y prenez pour cette technique ?',
            'Les ressources dans cette section sont fascinantes',
            'Quelqu\'un bosse sur le même projet que moi ?',
            'Cette fonctionnalité est vraiment pratique !',
            'J\'ai découvert un nouvel outil aujourd\'hui'
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
            'Salut ! Content de te voir ici !',
            'Hello ! Tu explores quelle zone aujourd\'hui ?',
            'Intéressant ! J\'aimerais en savoir plus.',
            'Bonne remarque ! Ça me fait réfléchir.',
            'Je vois ce que tu veux dire.',
            'C\'est une perspective intéressante !',
            'Merci pour le partage !',
            'Excellente question !',
            'Ça me rappelle quelque chose...',
            'Je suis d\'accord avec toi.'
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