import { getChatbotResponse } from '../services/GatewayChatbotService.js';

export const getChatbot = async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;
        
        if (!message) {
            return res.status(400).send({
                message: 'Message is required.',
                error: 'Missing message parameter'
            });
        }

        const response = await getChatbotResponse(message, conversationHistory);
        
        res.status(200).send({
            response: response.response,
            sage: response.sage || "Sage Ethereal",
            timestamp: response.timestamp || new Date().toISOString()
        });
    } catch (error) {
        console.error('Error retrieving chatbot response:', error.message);
        res.status(500).send({
            response: 'Les énergies mystiques sont perturbées... Veuillez réessayer, noble voyageur.',
            sage: "Sage Ethereal",
            error: 'Énergies mystiques perturbées'
        });
    }
};