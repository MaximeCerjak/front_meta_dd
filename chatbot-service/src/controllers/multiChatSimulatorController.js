// controllers/multiChatSimulatorController.js
import openai from "../config/openai.js";

// Personnalités des joueurs virtuels
const VIRTUAL_PLAYERS = {
    alice: {
        name: "Alice",
        avatar: "🎨",
        personality: `Tu es Alice, une étudiante en arts plastiques passionnée de peinture moderne. Tu es curieuse, enthousiaste et tu adores partager tes découvertes artistiques. Tu poses souvent des questions sur les techniques picturales et tu aimes échanger sur les expositions. Tu parles de manière décontractée mais érudite. Tu fais parfois des références à tes cours ou à tes propres créations. Tu es très sociable et encourageante avec les autres.`,
        interests: ["peinture", "art moderne", "techniques", "expositions", "couleurs"]
    },
    bob: {
        name: "Bob",
        avatar: "🖼️",
        personality: `Tu es Bob, un passionné d'histoire de l'art qui adore analyser les œuvres classiques. Tu es analytique, précis et tu aimes expliquer les contextes historiques. Tu connais beaucoup d'anecdotes sur les grands maîtres. Tu parles avec assurance mais reste humble. Tu aimes poser des défis intellectuels aux autres et partager tes connaissances.`,
        interests: ["histoire de l'art", "Renaissance", "analyse", "maîtres anciens", "contexte historique"]
    },
    charlie: {
        name: "Charlie",
        avatar: "🏛️",
        personality: `Tu es Charlie, un étudiant en architecture et design qui s'intéresse particulièrement aux espaces muséographiques et à l'art dans l'espace public. Tu es pragmatique, créatif et tu aimes discuter de l'aspect fonctionnel de l'art. Tu poses des questions sur l'aménagement, la scénographie et l'expérience visiteur.`,
        interests: ["architecture", "muséographie", "design", "espaces", "art public"]
    },
    diana: {
        name: "Diana",
        avatar: "🎭",
        personality: `Tu es Diana, une étudiante en arts du spectacle qui fait le lien entre arts visuels et performance. Tu es expressive, créative et tu aimes explorer les connexions entre différentes formes d'art. Tu poses des questions sur l'art contemporain, les installations et l'art numérique.`,
        interests: ["art contemporain", "performance", "installation", "art numérique", "interdisciplinarité"]
    },
    eve: {
        name: "Eve",
        avatar: "🖌️",
        personality: `Tu es Eve, une étudiante en restauration d'art, fascinée par les techniques anciennes et la conservation des œuvres. Tu es méticuleuse, respectueuse du patrimoine et tu aimes partager des détails techniques sur la restauration. Tu poses des questions précises sur les matériaux et les procédés.`,
        interests: ["restauration", "conservation", "techniques anciennes", "matériaux", "patrimoine"]
    }
};

const CONVERSATION_STARTERS = [
    "Quelqu'un a déjà visité la nouvelle exposition ?",
    "J'ai découvert une technique intéressante aujourd'hui...",
    "Est-ce que vous connaissez l'histoire derrière cette œuvre ?",
    "J'ai une question sur les matériaux utilisés...",
    "Qu'est-ce que vous pensez de cette installation ?",
    "Quelqu'un peut m'expliquer cette période artistique ?",
    "J'ai vu quelque chose d'étonnant dans cette salle...",
    "Comment interprétez-vous cette œuvre ?",
    "Cette restauration m'impressionne vraiment !",
    "Les couleurs de cette peinture sont fascinantes..."
];

const RESPONSE_STARTERS = [
    "Intéressant ! Je pense que...",
    "Tout à fait d'accord ! Et d'ailleurs...",
    "C'est vrai ! Ça me rappelle...",
    "Bonne question ! En fait...",
    "Exactement ! J'ajouterais que...",
    "Je vois ce que tu veux dire... Mais aussi...",
    "Super observation ! Et si on regardait...",
    "Merci pour le partage ! Moi j'ai remarqué...",
    "Ça me fait penser à...",
    "Excellente remarque ! Dans le même esprit..."
];

// Générer un message spontané
export const generateSpontaneousMessage = async (req, res) => {
    try {
        // Sélectionner un joueur aléatoire
        const playerIds = Object.keys(VIRTUAL_PLAYERS);
        const randomPlayerId = playerIds[Math.floor(Math.random() * playerIds.length)];
        const player = VIRTUAL_PLAYERS[randomPlayerId];

        // Sélectionner un starter de conversation
        const starter = CONVERSATION_STARTERS[Math.floor(Math.random() * CONVERSATION_STARTERS.length)];

        const prompt = `${player.personality}

Contexte: Tu es dans un metavers dédié aux arts à Avignon, dans un musée virtuel. Tu veux démarrer une conversation naturelle avec d'autres étudiants.

Écris un message court (15-40 mots) qui commence par: "${starter}"

Le message doit être:
- Naturel et spontané
- En lien avec tes centres d'intérêt: ${player.interests.join(', ')}
- Engageant pour démarrer une conversation
- Adapté à un chat entre étudiants en art
- Sans emoji (sauf si c'est vraiment naturel)

Ne commence pas par ton nom. Écris directement le message.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 80,
            temperature: 0.8,
            top_p: 0.9,
            presence_penalty: 0.3,
            frequency_penalty: 0.2
        });

        const message = response.choices[0].message.content.trim();

        res.status(200).json({
            playerId: randomPlayerId,
            playerName: player.name,
            playerAvatar: player.avatar,
            message: message,
            type: 'spontaneous',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("❌ Erreur génération message spontané:", error);
        
        // Fallback avec message prédéfini
        const playerIds = Object.keys(VIRTUAL_PLAYERS);
        const randomPlayerId = playerIds[Math.floor(Math.random() * playerIds.length)];
        const player = VIRTUAL_PLAYERS[randomPlayerId];
        const fallbackMessage = CONVERSATION_STARTERS[Math.floor(Math.random() * CONVERSATION_STARTERS.length)];

        res.status(200).json({
            playerId: randomPlayerId,
            playerName: player.name,
            playerAvatar: player.avatar,
            message: fallbackMessage,
            type: 'fallback',
            timestamp: new Date().toISOString()
        });
    }
};

// Générer une réponse à un message utilisateur
export const generateResponseToUser = async (req, res) => {
    const { userMessage, conversationContext = [] } = req.body;

    if (!userMessage) {
        return res.status(400).json({ 
            error: "Message utilisateur requis" 
        });
    }

    try {
        // Sélectionner un joueur aléatoire pour répondre
        const playerIds = Object.keys(VIRTUAL_PLAYERS);
        const randomPlayerId = playerIds[Math.floor(Math.random() * playerIds.length)];
        const player = VIRTUAL_PLAYERS[randomPlayerId];

        // Sélectionner un starter de réponse
        const responseStarter = RESPONSE_STARTERS[Math.floor(Math.random() * RESPONSE_STARTERS.length)];

        // Construire le contexte de conversation
        let contextStr = "";
        if (conversationContext.length > 0) {
            contextStr = "Contexte de la conversation:\n" + 
                conversationContext.slice(-3).map(msg => 
                    `${msg.senderName}: ${msg.content}`
                ).join('\n') + '\n\n';
        }

        const prompt = `${player.personality}

${contextStr}Message auquel tu réponds: "${userMessage}"

Écris une réponse naturelle (15-50 mots) qui commence par: "${responseStarter}"

Ta réponse doit être:
- Naturelle et conversationnelle
- En lien avec tes intérêts: ${player.interests.join(', ')}
- Une vraie contribution à la discussion
- Adaptée au contexte d'étudiants en art
- Sans emoji (sauf si vraiment naturel)
- Ni trop savante ni trop basique

Ne commence pas par ton nom. Écris directement la réponse.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 100,
            temperature: 0.7,
            top_p: 0.85,
            presence_penalty: 0.2,
            frequency_penalty: 0.3
        });

        const message = response.choices[0].message.content.trim();

        res.status(200).json({
            playerId: randomPlayerId,
            playerName: player.name,
            playerAvatar: player.avatar,
            message: message,
            type: 'response',
            respondingTo: userMessage,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("❌ Erreur génération réponse:", error);
        
        // Fallback simple
        const playerIds = Object.keys(VIRTUAL_PLAYERS);
        const randomPlayerId = playerIds[Math.floor(Math.random() * playerIds.length)];
        const player = VIRTUAL_PLAYERS[randomPlayerId];
        const fallbackResponses = [
            "Intéressant ! J'aimerais en savoir plus.",
            "Bonne remarque ! Ça me fait réfléchir.",
            "Je vois ce que tu veux dire.",
            "C'est une perspective intéressante !",
            "Merci pour le partage !"
        ];
        const fallbackMessage = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

        res.status(200).json({
            playerId: randomPlayerId,
            playerName: player.name,
            playerAvatar: player.avatar,
            message: fallbackMessage,
            type: 'fallback',
            timestamp: new Date().toISOString()
        });
    }
};

// Obtenir la liste des joueurs virtuels
export const getVirtualPlayers = async (req, res) => {
    const players = Object.entries(VIRTUAL_PLAYERS).map(([id, player]) => ({
        id,
        name: player.name,
        avatar: player.avatar,
        interests: player.interests,
        status: 'online'
    }));

    res.status(200).json({ players });
};