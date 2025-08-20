import ChatbotService from './ChatbotService.js';

/**
 * Bridge entre le ChatbotService existant et le composant React
 */
class ChatbotServiceBridge {
    constructor() {
        this.chatService = new ChatbotService();
    }

    /**
     * Envoie un message au service et retourne la réponse formatée pour React
     * @param {string} message - Message de l'utilisateur
     * @returns {Promise<string>} - Réponse du sage
     */
    async sendMessage(message) {
        try {
            const result = await this.chatService.sendMessage(message);
            
            if (result.success) {
                return result.sageMessage.content;
            } else {
                return result.sageMessage?.content || 'Une erreur mystique s\'est produite...';
            }
        } catch (error) {
            console.error('Erreur ChatbotServiceBridge:', error);
            
            if (error.message.includes('timeout')) {
                return 'Le Sage consulte des parchemins très anciens... Cela prend plus de temps que prévu. Pourriez-vous reformuler votre question ?';
            } else {
                return 'Une perturbation mystique empêche ma réponse... Veuillez réessayer, noble voyageur.';
            }
        }
    }

    /**
     * Vide l'historique de conversation
     */
    clearHistory() {
        this.chatService.clearHistory();
    }

    /**
     * Récupère l'historique des messages (si votre service le supporte)
     * @returns {Array} - Historique des messages
     */
    getHistory() {
        if (typeof this.chatService.getHistory === 'function') {
            return this.chatService.getHistory();
        }
        return [];
    }

    /**
     * Vérifie si le service est prêt
     * @returns {boolean}
     */
    isReady() {
        return this.chatService !== null;
    }
}

export default new ChatbotServiceBridge();