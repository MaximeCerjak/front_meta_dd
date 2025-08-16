import axios from "axios";

const CHATBOT_SERVICE_URL = process.env.CHATBOT_SERVICE_URL || "http://chatbot-service:6000/api";

export const getChatbotResponse = async (message, conversationHistory = []) => {
    try {
        const payload = {
            message,
            conversationHistory
        };

        console.log('Sending to chatbot service:', `${CHATBOT_SERVICE_URL}/chatbot`);
        console.log('Payload:', payload);

        const response = await axios.post(`${CHATBOT_SERVICE_URL}/chatbot`, payload);
        
        return {
            response: response.data.response,
            sage: response.data.sage || "Sage Ethereal",
            timestamp: response.data.timestamp || new Date().toISOString()
        };
    } catch (error) {
        console.error("Error getting chatbot response (Gateway Service):", error.response?.data || error.message);
        throw error;
    }
};