import ApiManager from '../../api/ApiManager'; 

export default class ChatbotService {
    constructor() {
        this.conversationHistory = [];
        this.isLoading = false;
        this.endpoint = 'chatbot';
    }

    addMessage(content, sender) {
        const message = {
            sender,
            content,
            timestamp: new Date().toISOString()
        };
        this.conversationHistory.push(message);
        return message;
    }

    async sendMessage(userMessage) {
        if (this.isLoading) {
            throw new Error('Une autre requête est en cours...');
        }

        try {
            this.isLoading = true;
            const userMsg = this.addMessage(userMessage, 'user');

            const payload = {
                message: userMessage,
                conversationHistory: this.getRecentHistory(5)
            };

            console.log('Envoi au service chatbot:', payload);
            // Utiliser ApiManager de manière statique
            const data = await ApiManager.chatWithBot(payload);
            const sageMsg = this.addMessage(data.response, 'sage');

            return {
                success: true,
                userMessage: userMsg,
                sageMessage: sageMsg,
                fullHistory: [...this.conversationHistory]
            };

        } catch (error) {
            console.error('Erreur ChatbotService:', error);
            var errorMsg = this.addMessage(
                'Une erreur est survenue lors de la communication avec le Sage Histoart.',
                'sage'
            );
            if (error.code === 'ECONNABORTED') {
                errorMsg = this.addMessage(
                    'Le Sage prend trop de temps à répondre. Veuillez réessayer avec une question plus simple.',
                    'sage'
                );
            }
            else {
                errorMsg = this.addMessage(
                    'Les énergies mystiques sont perturbées... Veuillez réessayer, noble voyageur.',
                    'sage'
                );
            }

            return {
                success: false,
                error: error.message,
                sageMessage: errorMsg,
                fullHistory: [...this.conversationHistory]
            };
        } finally {
            this.isLoading = false;
        }
    }

    getRecentHistory(limit = 5) {
        return this.conversationHistory.slice(-limit);
    }

    getFullHistory() {
        return [...this.conversationHistory];
    }

    clearHistory() {
        this.conversationHistory = [];
    }

    isRequestInProgress() {
        return this.isLoading;
    }

    getStats() {
        const userMessages = this.conversationHistory.filter(msg => msg.sender === 'user').length;
        const sageMessages = this.conversationHistory.filter(msg => msg.sender === 'sage').length;

        return {
            totalMessages: this.conversationHistory.length,
            userMessages,
            sageMessages,
            firstMessage: this.conversationHistory[0]?.timestamp || null,
            lastMessage: this.conversationHistory[this.conversationHistory.length - 1]?.timestamp || null
        };
    }
}