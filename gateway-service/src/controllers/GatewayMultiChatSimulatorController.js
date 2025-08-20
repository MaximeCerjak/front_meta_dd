// controllers/GatewayMultiChatSimulatorController.js
import { 
    generateSpontaneousMessage as getSpontaneousMessage, 
    generateResponseToUserMessage as getResponseToUserMessage, 
    getVirtualPlayers as getVirtualPlayersData 
} from '../services/GatewayMultiChatSimulatorService.js';

/**
 * Génère un message spontané d'un joueur virtuel
 */
export const generateSpontaneousMessage = async (req, res) => {
    try {
        const response = await getSpontaneousMessage();
        
        res.status(200).send({
            playerId: response.playerId,
            playerName: response.playerName,
            playerAvatar: response.playerAvatar,
            message: response.message,
            type: response.type,
            timestamp: response.timestamp
        });
    } catch (error) {
        console.error('Error generating spontaneous message:', error.message);
        
        // Fallback avec message prédéfini
        const fallbackPlayers = [
            { id: 'alice', name: 'Alice', avatar: '🎨' },
            { id: 'bob', name: 'Bob', avatar: '🖼️' },
            { id: 'charlie', name: 'Charlie', avatar: '🏛️' },
            { id: 'diana', name: 'Diana', avatar: '🎭' },
            { id: 'eve', name: 'Eve', avatar: '🖌️' }
        ];
        
        const fallbackMessages = [
            "Quelqu'un a des conseils pour améliorer mes techniques ?",
            "Cette exposition m'inspire vraiment !",
            "J'aimerais discuter des dernières tendances artistiques.",
            "Comment interprétez-vous cette œuvre ?",
            "Les couleurs de cette section sont fascinantes !"
        ];
        
        const randomPlayer = fallbackPlayers[Math.floor(Math.random() * fallbackPlayers.length)];
        const randomMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
        
        res.status(200).send({
            playerId: randomPlayer.id,
            playerName: randomPlayer.name,
            playerAvatar: randomPlayer.avatar,
            message: randomMessage,
            type: 'fallback',
            timestamp: new Date().toISOString()
        });
    }
};

/**
 * Génère une réponse à un message utilisateur
 */
export const generateResponseToUser = async (req, res) => {
    try {
        const { userMessage, conversationContext } = req.body;
        
        if (!userMessage) {
            return res.status(400).send({
                message: 'User message is required.',
                error: 'Missing userMessage parameter'
            });
        }

        console.log('🌐 Gateway: Requête reçue du frontend:', req.body);

        const response = await getResponseToUserMessage(userMessage, conversationContext);
        
        console.log('📥 Gateway: Données reçues du service:', response);
        console.log('📊 Gateway: Type des données:', typeof response);
        console.log('📋 Gateway: Clés des données:', Object.keys(response));
        
        res.status(200).send(response);
        
    } catch (error) {
        console.error('❌ Gateway: Erreur:', error);
        
        const fallbackPlayers = [
            { id: 'alice', name: 'Alice', avatar: '🎨' },
            { id: 'bob', name: 'Bob', avatar: '🖼️' },
            { id: 'charlie', name: 'Charlie', avatar: '🏛️' },
            { id: 'diana', name: 'Diana', avatar: '🎭' },
            { id: 'eve', name: 'Eve', avatar: '🖌️' }
        ];
        
        const fallbackResponses = [
            "Intéressant ! J'aimerais en savoir plus.",
            "Bonne remarque ! Ça me fait réfléchir.",
            "Je vois ce que tu veux dire.",
            "C'est une perspective intéressante !",
            "Merci pour le partage !",
            "Excellente question !",
            "Ça me rappelle quelque chose d'important.",
            "Je suis d'accord avec ton point de vue."
        ];
        
        const randomPlayer = fallbackPlayers[Math.floor(Math.random() * fallbackPlayers.length)];
        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

        res.status(200).send({
            responses: [{
                playerId: randomPlayer.id,
                playerName: randomPlayer.name,
                playerAvatar: randomPlayer.avatar,
                message: randomResponse,
                type: 'fallback',
                respondingTo: req.body.userMessage,
                timestamp: new Date().toISOString()
            }],
            analysis: {
                isGreeting: false,
                isQuestion: false,
                isHelpRequest: false,
                isSharing: false,
                priority: 'low'
            },
            responseCount: 1
        });
    }
};

/**
 * Récupère la liste des joueurs virtuels
 */
export const getVirtualPlayers = async (req, res) => {
    try {
        const response = await getVirtualPlayersData();
        
        res.status(200).send({
            players: response.players
        });
    } catch (error) {
        console.error('Error retrieving virtual players:', error.message);
        
        // Fallback avec joueurs prédéfinis
        const fallbackPlayers = [
            {
                id: 'alice',
                name: 'Alice',
                avatar: '🎨',
                interests: ['peinture', 'art moderne', 'techniques', 'expositions', 'couleurs'],
                status: 'online'
            },
            {
                id: 'bob',
                name: 'Bob',
                avatar: '🖼️',
                interests: ['histoire de l\'art', 'Renaissance', 'analyse', 'maîtres anciens', 'contexte historique'],
                status: 'online'
            },
            {
                id: 'charlie',
                name: 'Charlie',
                avatar: '🏛️',
                interests: ['architecture', 'muséographie', 'design', 'espaces', 'art public'],
                status: 'online'
            },
            {
                id: 'diana',
                name: 'Diana',
                avatar: '🎭',
                interests: ['art contemporain', 'performance', 'installation', 'art numérique', 'interdisciplinarité'],
                status: 'online'
            },
            {
                id: 'eve',
                name: 'Eve',
                avatar: '🖌️',
                interests: ['restauration', 'conservation', 'techniques anciennes', 'matériaux', 'patrimoine'],
                status: 'online'
            }
        ];
        
        res.status(200).send({
            players: fallbackPlayers
        });
    }
};