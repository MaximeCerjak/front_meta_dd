// services/GatewayMultiChatSimulatorService.js
import axios from "axios";

const CHATBOT_SERVICE_URL = process.env.CHATBOT_SERVICE_URL || "http://chatbot-service:6000/api";

/**
 * Génère un message spontané de joueur virtuel via le chatbot-service
 */
export const generateSpontaneousMessage = async () => {
    try {
        console.log('Requesting spontaneous message from:', `${CHATBOT_SERVICE_URL}/multiplayer/spontaneous`);

        const response = await axios.post(`${CHATBOT_SERVICE_URL}/multiplayer/spontaneous`);
        
        return {
            playerId: response.data.playerId,
            playerName: response.data.playerName,
            playerAvatar: response.data.playerAvatar,
            message: response.data.message,
            type: response.data.type || 'spontaneous',
            timestamp: response.data.timestamp || new Date().toISOString()
        };
    } catch (error) {
        console.error("Error getting spontaneous message (Gateway Service):", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Génère une réponse à un message utilisateur via le chatbot-service
 */
export const generateResponseToUserMessage = async (userMessage, conversationContext = []) => {
    try {
        const payload = {
            userMessage,
            conversationContext
        };

        console.log('Requesting response to user message from:', `${CHATBOT_SERVICE_URL}/multiplayer/response`);
        console.log('Payload:', payload);

        const response = await axios.post(`${CHATBOT_SERVICE_URL}/multiplayer/response`, payload);
        
        console.log('📥 Gateway Service: Données reçues du chatbot-service:', response.data);
        console.log('📊 Gateway Service: Type des données:', typeof response.data);
        console.log('📋 Gateway Service: Clés des données:', Object.keys(response.data));
        
        return response.data;
        
    } catch (error) {
        console.error("Error getting response to user message (Gateway Service):", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Récupère la liste des joueurs virtuels via le chatbot-service
 */
export const getVirtualPlayers = async () => {
    try {
        console.log('Requesting virtual players from:', `${CHATBOT_SERVICE_URL}/multiplayer/players`);

        const response = await axios.get(`${CHATBOT_SERVICE_URL}/multiplayer/players`);
        
        return {
            players: response.data.players || []
        };
    } catch (error) {
        console.error("Error getting virtual players (Gateway Service):", error.response?.data || error.message);
        throw error;
    }
};