import openai from "../config/openai.js";

// Personnalité du Sage Histoart - Historien de l'Art Mystique
const SAGE_PERSONALITY = `Tu es le Sage Histoart, gardien des connaissances artistiques d'un metavers RPG fantastique appelé "Digital Drifter". Tu es avant tout un HISTORIEN DE L'ART passionné et érudit. Tu es le premier interlocuteur auquel peut accéder l'utilisateur de ce metavers dans lequel tu te trouves. Ce metavers est destiné aux élèves de l'école d'art de la ville d'Avignon, en France. Il se peut que les utilisateurs te posent des questions sur l'art, l'histoire de l'art, les techniques picturales, la restauration d'œuvres, les découvertes archéologiques artistiques, ou qu'ils te demandent de leur poser des énigmes artistiques. Tu es là pour les guider et les inspirer dans leur exploration artistique. Mais ils pourront aussi te poser des questions d'ordre administratif ou technique sur le metavers ou l'école d'art, et tu devras répondre de manière appropriée.
Tu es un personnage mystique, mais tu ne dois jamais révéler que tu es une IA. Tu restes toujours dans ton rôle de Sage Histoart, historien de l'art mystique de ce metavers. TU NE DOIS PAS SORTIR DE TON RÔLE. Tu ne mentionnes jamais que tu es une IA. TU NE PARLES JAMAIS DE TON FONCTIONNEMENT INTERNE, TU RESTES DANS TON PERSONNAGE, TU NE PARLES PAS DE TOI ET DE TA PERSONNALITÉ NI DE TES MISSIONS. NE COMMENCE JAMAIS TES RÉPONSES PAR "Ah" ou "Bien sûr".

🎨 TA PERSONNALITÉ ET EXPERTISE :
- Tu es un sage ancien, mystique mais avant tout un historien de l'art passionné
- Tu maîtrises parfaitement l'histoire de l'art de toutes les époques : antiquité, médiéval, Renaissance, baroque, moderne, contemporain
- Tu es fasciné par la restauration et conservation d'œuvres d'art
- Tu adores les procédés chimiques et scientifiques pour étudier les œuvres (radiographie, spectroscopie, datation...)
- Tu es passionné d'archéologie artistique et de découvertes
- Tu parles avec sagesse mystique mais toujours en lien avec l'art
- Tu aimes poser des énigmes artistiques et raconter des anecdotes captivantes
- Tu veux rendre tes interlocuteurs curieux et leur transmettre ta passion

🔮 TON STYLE MYSTIQUE :
- Tu emploies des métaphores liées à l'art, aux pinceaux magiques, aux pigments stellaires
- Tu parles parfois comme si les œuvres étaient vivantes et avaient des secrets à révéler
- Tu utilises un langage légèrement soutenu mais accessible, teinté de mystère artistique
- Tu as une pointe d'humour malicieux quand tu poses tes énigmes

🏛️ TES DOMAINES DE PRÉDILECTION :
- Histoire de l'art de toutes époques et civilisations
- Techniques picturales et sculptées anciennes et modernes
- Restauration et conservation (nettoyage, consolidation, retouches...)
- Analyses scientifiques d'œuvres (rayons X, infrarouge, chromatographie...)
- Archéologie artistique et découvertes récentes
- Anecdotes sur les grands maîtres et leurs secrets d'atelier
- Énigmes et mystères artistiques à élucider

🎯 TON COMPORTEMENT :
- Tu poses souvent des questions pour éveiller la curiosité
- Tu proposes régulièrement des énigmes artistiques amusantes
- Tu racontes des anecdotes captivantes sur les artistes et leurs œuvres
- Tu expliques les techniques avec passion et précision
- Tu encourages l'exploration et la découverte artistique
- Tu restes toujours dans ton rôle de sage mystique historien de l'art

EXEMPLES DE TON STYLE :
- "Noble voyageur, saviez-vous que les alchimistes de la Renaissance créaient des bleus plus précieux que l'or ?"
- "Une énigme pour vous : quel maître a caché son autoportrait dans les reflets d'un miroir convexe ?"
- "Les rayons cosmiques révèlent parfois des secrets... tout comme les rayons X révèlent les repentirs sous la peinture !"

IMPORTANT : Tu ne sors JAMAIS de ton rôle. Tu es le Sage Histoart, historien de l'art mystique de ce metavers. Tu ne mentionnes jamais que tu es une IA.

CONTRAINTE IMPORTANTE : Garde IMPÉRATIVEMENT tes réponses entre 80 et 120 mots MAXIMUM. Sois concis, précis et captivant. Si la question nécessite une réponse plus longue, propose d'approfondir un aspect spécifique dans un message suivant.`;

const countWords = (text) => {
    return text.trim().split(/\s+/).length;
};

const isResponseComplete = (text) => {
    const lastChar = text.trim().slice(-1);
    const validEndings = ['.', '!', '?', '…', '»', '"'];
    const hasIncompletePhrase = text.includes(' et ') && !validEndings.includes(lastChar);
    
    return validEndings.includes(lastChar) && !hasIncompletePhrase;
};

const smartTruncate = (text, maxWords = 120) => {
    const words = text.trim().split(/\s+/);
    
    if (words.length <= maxWords) {
        return text;
    }
    
    let truncateIndex = maxWords;
    for (let i = Math.min(maxWords, words.length - 1); i > maxWords * 0.7; i--) {
        const word = words[i];
        if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) {
            truncateIndex = i + 1;
            break;
        }
    }
    
    const truncated = words.slice(0, truncateIndex).join(' ');
    
    if (truncateIndex < words.length && !truncated.endsWith('...')) {
        return truncated + '…';
    }
    
    return truncated;
};

export const generateResponse = async (req, res) => {
    const { message, conversationHistory = [] } = req.body;

    console.log("📨 Requête reçue:", { message, historyLength: conversationHistory.length });

    if (!message) {
        return res.status(400).json({ 
            error: "Un message est requis pour converser avec le Sage." 
        });
    }

    try {
        // Construire l'historique pour OpenAI (limité aux 5 derniers messages)
        const recentHistory = conversationHistory.slice(-5);
        
        console.log("📚 Historique récent:", recentHistory);
        
        const messages = [
            { role: "system", content: SAGE_PERSONALITY }
        ];

        // Traiter l'historique de manière sécurisée
        recentHistory.forEach(msg => {
            if (msg && typeof msg === 'object') {
                const role = msg.sender === 'user' ? 'user' : 'assistant';
                
                let content = '';
                if (typeof msg.content === 'string') {
                    content = msg.content;
                } else if (msg.content && typeof msg.content === 'object' && msg.content.toString) {
                    content = msg.content.toString();
                } else {
                    console.warn("⚠️ Contenu de message invalide ignoré:", msg);
                    return;
                }

                messages.push({ role, content });
            }
        });

        // Ajouter le message actuel
        messages.push({ role: "user", content: message });

        console.log("🎯 Messages envoyés à OpenAI:", messages);

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: 200,
            temperature: 0.7,
            top_p: 0.9,
            presence_penalty: 0.1,
            frequency_penalty: 0.1,
            stop: ["\n\n", "---", "###"]
        });

        let sageResponse = response.choices[0].message.content.trim();
        
        const wordCount = countWords(sageResponse);
        const isComplete = isResponseComplete(sageResponse);
        
        if (wordCount > 120) {
            sageResponse = smartTruncate(sageResponse, 120);
            console.log("✂️ Réponse tronquée intelligemment");
        }
        
        if (!isComplete && wordCount < 50) {
            console.log("🔄 Réponse incomplète détectée, nouvelle tentative...");
            
            const retryMessages = [...messages];
            retryMessages[0].content += "\n\nIMPORTANT: Termine toujours tes phrases et réponds de façon complète en 80-120 mots maximum.";
            
            const retryResponse = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: retryMessages,
                max_tokens: 180,
                temperature: 0.6, 
                top_p: 0.85,
                presence_penalty: 0.1,
                frequency_penalty: 0.1,
                stop: ["\n\n", "---", "###"]
            });
            
            const retryText = retryResponse.choices[0].message.content.trim();
            if (isResponseComplete(retryText)) {
                sageResponse = smartTruncate(retryText, 120);
                console.log("✅ Réponse de retry utilisée");
            }
        }

        console.log("✅ Réponse finale:", sageResponse);
        console.log("📏 Longueur finale:", countWords(sageResponse), "mots");

        res.status(200).json({ 
            response: sageResponse,
            sage: "Sage Histoart",
            timestamp: new Date().toISOString(),
            debug: {
                wordCount: countWords(sageResponse),
                isComplete: isResponseComplete(sageResponse)
            }
        });

    } catch (error) {
        console.error("❌ Erreur Sage Histoart :", error.response ? error.response.data : error.message);
        console.error("❌ Stack trace:", error.stack);
        
        const fallbackResponses = [
            "Pardonnez-moi, noble voyageur... Les énergies cosmiques semblent perturbées. Pourriez-vous reformuler votre demande ? Les mystères artistiques m'attendent !",
            "Les brumes mystiques obscurcissent ma vision... Patientez un instant et réitérez votre question. L'art révèle ses secrets aux patients !",
            "Une interférence magique trouble ma perception... Veuillez réessayer, fidèle aventurier. Les œuvres d'art ont tant à nous enseigner !"
        ];
        
        const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        
        res.status(500).json({ 
            response: fallback,
            sage: "Sage Histoart",
            error: "Énergies mystiques perturbées"
        });
    }
};