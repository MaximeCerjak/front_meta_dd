// src/game/services/WebSocketBridge.js
import WebSocketChatService from './WebSocketChatService';

/**
 * Bridge simplifié pour centraliser la logique WebSocket
 * Pattern identique à ChatbotServiceBridge
 */
class WebSocketBridge {
    constructor() {
        this.chatService = null;
        this.isInitialized = false;
    }

    /**
     * Initialise le service WebSocket
     */
    async initialize() {
        if (this.isInitialized) {
            console.log('WebSocketBridge déjà initialisé');
            return true;
        }

        try {
            this.chatService = new WebSocketChatService();
            await this.chatService.connect();
            this.isInitialized = true;
            
            console.log('WebSocketBridge initialisé avec succès');
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'initialisation WebSocketBridge:', error);
            return false;
        }
    }

    /**
     * Envoie un message via le service WebSocket
     */
    async sendMessage(content, type = 'global') {
        if (!this.chatService || !this.isInitialized) {
            console.warn('Service WebSocket non initialisé');
            return false;
        }

        return this.chatService.sendMessage(content, type);
    }

    /**
     * Gère les changements de scène
     */
    updateUserScene(sceneKey) {
        if (this.chatService && this.isInitialized) {
            this.chatService.updateUserScene(sceneKey);
        }
    }

    /**
     * Déconnecte le service WebSocket
     */
    disconnect() {
        if (this.chatService) {
            this.chatService.disconnect();
            this.chatService = null;
            this.isInitialized = false;
        }
    }

    /**
     * Récupère l'état de la connexion
     */
    isConnected() {
        return this.chatService ? this.chatService.isWebSocketConnected() : false;
    }

    /**
     * Récupère la liste des joueurs connectés
     */
    getConnectedPlayers() {
        return this.chatService ? this.chatService.getConnectedPlayers() : [];
    }

    /**
     * Récupère l'historique des messages
     */
    getMessageHistory(limit = 50) {
        return this.chatService ? this.chatService.getMessageHistory(limit) : [];
    }

    /**
     * Nettoyage du bridge
     */
    destroy() {
        this.disconnect();
    }
}

export default new WebSocketBridge();