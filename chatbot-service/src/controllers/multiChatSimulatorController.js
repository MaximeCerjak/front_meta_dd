import openai from '../config/openai.js';

// Personnalités des joueurs virtuels
const VIRTUAL_PLAYERS = {
    alice: {
        name: 'Alice',
        avatar: '🎨',
        personality: 'Tu es Alice, une étudiante en arts plastiques passionnée de peinture moderne. Tu es curieuse, enthousiaste et tu adores partager tes découvertes artistiques. Tu poses souvent des questions sur les techniques picturales et tu aimes échanger sur les expositions. Tu parles de manière décontractée mais érudite. Tu fais parfois des références à tes cours ou à tes propres créations. Tu es très sociable et encourageante avec les autres. Tu réponds TOUJOURS aux salutations et questions directes.',
        interests: ['peinture', 'art moderne', 'techniques', 'expositions', 'couleurs'],
        responsiveness: 0.8
    },
    bob: {
        name: 'Bob',
        avatar: '🖼️',
        personality: 'Tu es Bob, un passionné d\'histoire de l\'art qui adore analyser les œuvres classiques. Tu es analytique, précis et tu aimes expliquer les contextes historiques. Tu connais beaucoup d\'anecdotes sur les grands maîtres. Tu parles avec assurance mais reste humble. Tu aimes poser des défis intellectuels aux autres et partager tes connaissances. Tu réponds toujours aux questions et salutations, même si tu préfères les discussions approfondies.',
        interests: ['histoire de l\'art', 'Renaissance', 'analyse', 'maîtres anciens', 'contexte historique'],
        responsiveness: 0.7
    },
    charlie: {
        name: 'Charlie',
        avatar: '🏛️',
        personality: 'Tu es Charlie, un étudiant en architecture et design qui s\'intéresse particulièrement aux espaces muséographiques et à l\'art dans l\'espace public. Tu es pragmatique, créatif et tu aimes discuter de l\'aspect fonctionnel de l\'art. Tu poses des questions sur l\'aménagement, la scénographie et l\'expérience visiteur. Tu es poli et réponds aux salutations avec cordialité.',
        interests: ['architecture', 'muséographie', 'design', 'espaces', 'art public'],
        responsiveness: 0.6
    },
    diana: {
        name: 'Diana',
        avatar: '🎭',
        personality: 'Tu es Diana, une étudiante en arts du spectacle qui fait le lien entre arts visuels et performance. Tu es expressive, créative et tu aimes explorer les connexions entre différentes formes d\'art. Tu poses des questions sur l\'art contemporain, les installations et l\'art numérique. Tu es très expressive et chaleureuse dans tes interactions.',
        interests: ['art contemporain', 'performance', 'installation', 'art numérique', 'interdisciplinarité'],
        responsiveness: 0.9
    },
    eve: {
        name: 'Eve',
        avatar: '🖌️',
        personality: 'Tu es Eve, une étudiante en restauration d\'art, fascinée par les techniques anciennes et la conservation des œuvres. Tu es méticuleuse, respectueuse du patrimoine et tu aimes partager des détails techniques sur la restauration. Tu poses des questions précises sur les matériaux et les procédés. Tu es polie mais parfois timide, tu réponds mais de manière plus réservée.',
        interests: ['restauration', 'conservation', 'techniques anciennes', 'matériaux', 'patrimoine'],
        responsiveness: 0.5
    }
};

const CONVERSATION_STARTERS = [
    'Quelqu\'un a déjà testé cette nouvelle fonctionnalité ?',
    'J\'ai découvert une technique intéressante aujourd\'hui...',
    'Est-ce que vous connaissez l\'histoire derrière cette œuvre ?',
    'J\'ai une question sur les matériaux qu\'on utilise en cours...',
    'Qu\'est-ce que vous pensez de ce projet ?',
    'Quelqu\'un peut m\'expliquer cette période artistique ?',
    'J\'ai vu quelque chose d\'étonnant dans cette zone...',
    'Comment vous vous y prenez pour cette technique ?',
    'Cette installation dans l\'atelier m\'impressionne !',
    'Les couleurs de cette création sont fascinantes...',
    'Quelqu\'un bosse sur le même projet que moi ?',
    'Vous avez vu le nouveau cours qui vient de sortir ?',
    'J\'ai galéré avec cet exercice aujourd\'hui...',
    'Cette zone de la plateforme est vraiment bien conçue !',
    'Quelqu\'un connaît des astuces pour cette technique ?'
];

const GREETING_RESPONSES = [
    'Salut ! Content de te voir ici !',
    'Hello ! Tu explores quelle zone aujourd\'hui ?',
    'Bonjour ! Bienvenue sur la plateforme !',
    'Coucou ! Tu tombes bien, on discutait justement d\'art !',
    'Salut ! Tu es nouveau sur le metavers ?',
    'Hey ! Super de te croiser !',
    'Bonjour ! Tu bosses sur quoi en ce moment ?',
    'Salut ! Ça va ? Tu étudies dans quelle spécialité ?',
    'Hello ! Tu as testé les nouveaux ateliers virtuels ?',
    'Coucou ! Tu viens souvent dans cette zone ?'
];

const RESPONSE_STARTERS = [
    'Intéressant ! Je pense que...',
    'Tout à fait d\'accord ! Et d\'ailleurs...',
    'C\'est vrai ! Ça me rappelle...',
    'Bonne question ! En fait...',
    'Exactement ! J\'ajouterais que...',
    'Je vois ce que tu veux dire... Mais aussi...',
    'Super observation ! Et si on regardait...',
    'Merci pour le partage ! Moi j\'ai remarqué...',
    'Ça me fait penser à...',
    'Excellente remarque ! Dans le même esprit...'
];

// Analyser le type de message utilisateur
const analyzeMessageType = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Détection des salutations
    const greetings = ['bonjour', 'bonsoir', 'salut', 'hello', 'hey', 'coucou', 'tout le monde'];
    const isGreeting = greetings.some(greeting => lowerMessage.includes(greeting));
    
    // Détection des questions
    const questionMarkers = ['?', 'comment', 'pourquoi', 'que pensez', 'qu\'est-ce', 'qui sait', 'quelqu\'un', 'pouvez-vous'];
    const isQuestion = questionMarkers.some(marker => lowerMessage.includes(marker));
    
    // Détection d'appel à l'aide ou recherche d'info
    const helpMarkers = ['aide', 'expliquer', 'comprendre', 'savoir', 'connaître', 'avis'];
    const isHelpRequest = helpMarkers.some(marker => lowerMessage.includes(marker));
    
    // Détection de partage d'info/opinion
    const shareMarkers = ['je pense', 'j\'ai vu', 'j\'ai découvert', 'regardez', 'selon moi', 'à mon avis'];
    const isSharing = shareMarkers.some(marker => lowerMessage.includes(marker));
    
    return {
        isGreeting,
        isQuestion,
        isHelpRequest,
        isSharing,
        priority: isGreeting ? 'high' : (isQuestion || isHelpRequest) ? 'high' : isSharing ? 'medium' : 'low'
    };
};

// Calculer combien de joueurs doivent répondre
const calculateResponseCount = (messageAnalysis, messageLength) => {
    const { priority, isGreeting, isQuestion } = messageAnalysis;
    
    if (isGreeting) return Math.random() < 0.8 ? 2 : 1; // 80% de chance d'avoir 2 réponses pour une salutation
    if (isQuestion) return Math.random() < 0.7 ? 2 : 1; // 70% de chance d'avoir 2 réponses pour une question
    if (priority === 'high') return Math.random() < 0.6 ? 2 : 1;
    if (priority === 'medium') return Math.random() < 0.4 ? 1 : 0;
    
    return Math.random() < 0.3 ? 1 : 0; // Messages basiques: 30% de chance de réponse
};

// Sélectionner les joueurs qui vont répondre
const selectRespondingPlayers = (messageAnalysis, responseCount) => {
    const playerIds = Object.keys(VIRTUAL_PLAYERS);
    const availablePlayers = playerIds.map(id => ({
        id,
        ...VIRTUAL_PLAYERS[id],
        adjustedResponsiveness: VIRTUAL_PLAYERS[id].responsiveness * (messageAnalysis.priority === 'high' ? 1.3 : 1)
    }));
    
    availablePlayers.sort((a, b) => b.adjustedResponsiveness - a.adjustedResponsiveness);
    
    const selectedPlayers = [];
    
    for (let i = 0; i < Math.min(responseCount, availablePlayers.length); i++) {
        const player = availablePlayers[i];
        if (Math.random() < player.adjustedResponsiveness || selectedPlayers.length === 0) {
            selectedPlayers.push(player);
        }
    }

    if (selectedPlayers.length === 0 && messageAnalysis.priority === 'high') {
        selectedPlayers.push(availablePlayers[0]);
    }
    
    return selectedPlayers;
};

// Générer un message spontané
export const generateSpontaneousMessage = async (req, res) => {
    try {
        const playerIds = Object.keys(VIRTUAL_PLAYERS);
        const randomPlayerId = playerIds[Math.floor(Math.random() * playerIds.length)];
        const player = VIRTUAL_PLAYERS[randomPlayerId];

        const starter = CONVERSATION_STARTERS[Math.floor(Math.random() * CONVERSATION_STARTERS.length)];

        const prompt = `${player.personality}

Contexte: Tu es sur la plateforme metavers de l'école d'art d'Avignon. Tu peux être dans différentes zones : ateliers, salles d'exposition, espaces de détente, bibliothèque, cours virtuels, etc. Tu veux démarrer une conversation naturelle avec d'autres étudiants.

Écris un message court (15-40 mots) qui commence par: "${starter}"

Le message doit être:
- Naturel et spontané
- En lien avec tes centres d'intérêt: ${player.interests.join(', ')}
- Engageant pour démarrer une conversation
- Adapté à un chat entre étudiants de l'école d'art
- Sans emoji (sauf si c'est vraiment naturel)

Ne commence pas par ton nom. Écris directement le message.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
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
        console.error('❌ Erreur génération message spontané:', error);
        
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

// Générer des réponses à un message utilisateur (peut générer plusieurs réponses)
export const generateResponseToUser = async (req, res) => {
    const { userMessage, conversationContext = [] } = req.body;

    if (!userMessage) {
        return res.status(400).json({ 
            error: 'Message utilisateur requis' 
        });
    }

    try {
        const messageAnalysis = analyzeMessageType(userMessage);
        console.log('📊 Analyse du message:', messageAnalysis);
        
        const responseCount = calculateResponseCount(messageAnalysis, userMessage.length);
        console.log('🎯 Nombre de réponses prévues:', responseCount);
        
        if (responseCount === 0) {
            return res.status(200).json({
                responses: [],
                analysis: messageAnalysis,
                message: 'Aucune réponse générée pour ce message'
            });
        }
        
        const respondingPlayers = selectRespondingPlayers(messageAnalysis, responseCount);
        console.log('👥 Joueurs qui répondent:', respondingPlayers.map(p => p.name));
        
        const responses = [];
        
        for (const player of respondingPlayers) {
            try {
                console.log(`🤖 Début génération pour ${player.name}...`);
                
                let responseStarter;
                
                if (messageAnalysis.isGreeting) {
                    responseStarter = GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)];
                } else {
                    responseStarter = RESPONSE_STARTERS[Math.floor(Math.random() * RESPONSE_STARTERS.length)];
                }

                console.log(`🎭 Response starter sélectionné: "${responseStarter}"`);

                let contextStr = '';
                if (conversationContext.length > 0) {
                    contextStr = 'Contexte de la conversation:\n' + 
                        conversationContext.slice(-3).map(msg => 
                            `${msg.senderName}: ${msg.content}`
                        ).join('\n') + '\n\n';
                }

                let promptInstruction;
                if (messageAnalysis.isGreeting) {
                    promptInstruction = `Réponds à cette salutation de manière chaleureuse et naturelle. Commence par: "${responseStarter}"`;
                } else if (messageAnalysis.isQuestion) {
                    promptInstruction = `Réponds à cette question en apportant une vraie information ou ton point de vue. Commence par: "${responseStarter}"`;
                } else {
                    promptInstruction = `Réagis à ce message de manière naturelle et engageante. Commence par: "${responseStarter}"`;
                }

                const prompt = `${player.personality}

        ${contextStr}Message auquel tu réponds: "${userMessage}"

        ${promptInstruction}

        Ta réponse doit être:
        - Naturelle et conversationnelle (15-50 mots)
        - En lien avec tes intérêts: ${player.interests.join(', ')}
        - Une vraie contribution à la discussion
        - Adaptée au contexte d'étudiants sur la plateforme metavers de l'école d'art
        - Sans emoji (sauf si vraiment naturel)

        Contexte plateforme: Vous êtes sur le metavers éducatif de l'école d'art d'Avignon, avec différentes zones (ateliers, expositions, cours, espaces détente...).

        Ne commence pas par ton nom. Écris directement la réponse.`;

                console.log(`📝 Appel OpenAI pour ${player.name}...`);

                const response = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 100,
                    temperature: 0.7,
                    top_p: 0.85,
                    presence_penalty: 0.2,
                    frequency_penalty: 0.3
                });

                console.log(`✅ OpenAI a répondu pour ${player.name}`);

                if(response) {
                    console.log('📥 Réponse générée:', response.choices[0].message.content);
                }

                const message = response.choices[0].message.content.trim();
                
                console.log(`📦 Création objet réponse pour ${player.name}...`);
                
                const playerResponse = {
                    playerId: player.id,
                    playerName: player.name,
                    playerAvatar: player.avatar,
                    message: message,
                    type: 'response',
                    respondingTo: userMessage,
                    timestamp: new Date().toISOString()
                };
                
                console.log(`📋 Objet créé:`, playerResponse);
                
                responses.push(playerResponse);
                
                console.log(`📊 Responses array: ${responses.length} éléments`);
                
                if (responses.length < respondingPlayers.length) {
                    console.log(`⏳ Attente avant prochaine génération...`);
                    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
                }
                
                console.log(`✅ ${player.name} terminé avec succès`);
                
            } catch (playerError) {
                console.error(`❌ Erreur spécifique pour ${player.name}:`, playerError);
                console.error(`❌ Stack trace:`, playerError.stack);
                // Ne pas interrompre la boucle, continuer avec le prochain joueur
            }
        }
        console.log('📦 Toutes les réponses générées:', responses);

        // IMPORTANT: Vérifiez que vous retournez bien ceci
        console.log('📤 Réponse envoyée:', { responses, analysis: messageAnalysis, responseCount: responses.length });
        
        res.status(200).json({
            responses: responses,
            analysis: messageAnalysis,
            responseCount: responses.length
        });

    } catch (error) {
        console.error('❌ Erreur génération réponse:', error);
        console.error('❌ STACK TRACE COMPLET:', error.stack);
        console.error('❌ RESPONSES ACTUELS:', responses);
        console.error('❌ MESSAGE ANALYSIS:', messageAnalysis);
        
        // Même pour le fallback, retournez le bon format
        const playerIds = Object.keys(VIRTUAL_PLAYERS);
        const randomPlayerId = playerIds[Math.floor(Math.random() * playerIds.length)];
        const player = VIRTUAL_PLAYERS[randomPlayerId];
        
        const fallbackMessage = messageAnalysis?.isGreeting 
            ? GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)]
            : 'Intéressant ! J\'aimerais en savoir plus.';

        res.status(200).json({
            responses: [{
                playerId: randomPlayerId,
                playerName: player.name,
                playerAvatar: player.avatar,
                message: fallbackMessage,
                type: 'fallback',
                respondingTo: userMessage,
                timestamp: new Date().toISOString()
            }],
            analysis: messageAnalysis || {},
            responseCount: 1
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
        responsiveness: player.responsiveness,
        status: 'online'
    }));

    res.status(200).json({ players });
};