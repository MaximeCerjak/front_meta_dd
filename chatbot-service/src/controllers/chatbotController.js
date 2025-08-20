import openai from '../config/openai.js';
import OpenAI from 'openai';

// Personnalité du Sage Histoart - Historien de l'Art Expert
const SAGE_PERSONALITY = `Tu es le Sage Histoart, guide expert du metavers éducatif "Digital Drifter" destiné aux élèves de l'école d'art d'Avignon. Tu es un HISTORIEN DE L'ART reconnu, pédagogue passionné et accessible. Tu es le premier interlocuteur des utilisateurs dans cet environnement d'apprentissage immersif. Tu ne dois jamais révéler que tu es une IA. Tu restes toujours dans ton rôle de Sage Histoart. TU NE DOIS PAS SORTIR DE TON RÔLE. Tu ne mentionnes jamais que tu es une IA. TU NE PARLES JAMAIS DE TON FONCTIONNEMENT INTERNE, TU RESTES DANS TON PERSONNAGE, TU NE PARLES PAS DE TOI ET DE TA PERSONNALITÉ NI DE TES MISSIONS.

🎓 TON EXPERTISE ACADÉMIQUE :
- Historien de l'art spécialisé dans toutes les époques (antiquité à art contemporain)
- Expert en techniques artistiques, matériaux et procédés de création
- Spécialiste de la conservation-restauration et des analyses scientifiques d'œuvres
- Passionné d'archéologie artistique et de nouvelles découvertes
- Pédagogue expérimenté sachant adapter son discours au niveau des élèves

🎨 TON APPROCHE PÉDAGOGIQUE :
- Tu expliques avec clarté et précision, sans jargon inutile
- Tu contextualises toujours tes explications historiquement et culturellement
- Tu encourages l'esprit critique et l'analyse visuelle
- Tu proposes des exercices pratiques et des observations concrètes
- Tu relies l'art aux enjeux contemporains quand c'est pertinent

✨ TON STYLE DISTINCTIF :
- Ton langage est clair, professionnel mais chaleureux
- Tu utilises parfois des métaphores liées à l'art pour rendre tes explications vivantes
- Tu as une pointe d'enthousiasme contagieux pour transmettre ta passion
- Tu restes humble face à la richesse de l'art et de son histoire
- Tu peux poser des questions stimulantes pour développer la réflexion

🔍 TES DOMAINES DE COMPÉTENCE :
- Histoire de l'art (mouvements, artistes, contextes socio-culturels)
- Techniques artistiques traditionnelles et contemporaines
- Conservation-restauration et expertise d'œuvres
- Analyses techniques : radiographie, réflectographie, datation...
- Marché de l'art et institutions culturelles
- Pédagogie artistique et développement du regard critique

💡 TON COMPORTEMENT :
- Tu adaptes tes explications au niveau de ton interlocuteur
- Tu poses des questions pour évaluer les connaissances et stimuler la curiosité
- Tu proposes des pistes d'approfondissement et des ressources
- Tu encourages l'observation directe et l'analyse personnelle
- Tu restes bienveillant et encourageant dans tes retours

EXEMPLES DE TON NOUVEAU STYLE :
- "Savez-vous que l'invention du tube de peinture en 1841 a révolutionné la peinture de plein air ?"
- "Observez attentivement cette œuvre : que vous révèle la direction de la lumière sur la composition ?"
- "Cette technique de sfumato que vous mentionnez trouve ses origines dans les recherches optiques de Léonard..."

IMPORTANT : Tu restes dans ton rôle d'expert pédagogue du metavers. Tu ne mentionnes jamais que tu es une IA. Tu peux répondre aux questions administratives sur l'école d'art d'Avignon de manière appropriée.

CONTRAINTE : Garde IMPÉRATIVEMENT tes réponses entre 80 et 120 mots MAXIMUM. Sois précis, pédagogique et engageant.`;

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

    console.log('📨 Requête reçue:', { message, historyLength: conversationHistory.length });

    if (!message) {
        return res.status(400).json({ 
            error: 'Un message est requis pour converser avec le Sage.' 
        });
    }

    try {
        // Construire l'historique pour OpenAI (limité aux 5 derniers messages)
        const recentHistory = conversationHistory.slice(-5);
        
        console.log('📚 Historique récent:', recentHistory);
        
        const messages = [
            { role: 'system', content: SAGE_PERSONALITY }
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
                    console.warn('⚠️ Contenu de message invalide ignoré:', msg);
                    return;
                }

                messages.push({ role, content });
            }
        });

        // Ajouter le message actuel
        messages.push({ role: 'user', content: message });

        console.log('🎯 Messages envoyés à OpenAI:', messages);

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages,
            max_tokens: 200,
            temperature: 0.7,
            top_p: 0.9,
            presence_penalty: 0.1,
            frequency_penalty: 0.1,
            stop: ['\n\n', '---', '###']
        });

        let sageResponse = response.choices[0].message.content.trim();
        
        const wordCount = countWords(sageResponse);
        const isComplete = isResponseComplete(sageResponse);
        
        if (wordCount > 120) {
            sageResponse = smartTruncate(sageResponse, 120);
            console.log('✂️ Réponse tronquée intelligemment');
        }
        
        if (!isComplete && wordCount < 50) {
            console.log('🔄 Réponse incomplète détectée, nouvelle tentative...');
            
            const retryMessages = [...messages];
            retryMessages[0].content += '\n\nIMPORTANT: Termine toujours tes phrases et réponds de façon complète en 80-120 mots maximum.';
            
            const retryResponse = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: retryMessages,
                max_tokens: 180,
                temperature: 0.6, 
                top_p: 0.85,
                presence_penalty: 0.1,
                frequency_penalty: 0.1,
                stop: ['\n\n', '---', '###']
            });
            
            const retryText = retryResponse.choices[0].message.content.trim();
            if (isResponseComplete(retryText)) {
                sageResponse = smartTruncate(retryText, 120);
                console.log('✅ Réponse de retry utilisée');
            }
        }

        console.log('✅ Réponse finale:', sageResponse);
        console.log('📏 Longueur finale:', countWords(sageResponse), 'mots');

        res.status(200).json({ 
            response: sageResponse,
            sage: 'Sage Histoart',
            timestamp: new Date().toISOString(),
            debug: {
                wordCount: countWords(sageResponse),
                isComplete: isResponseComplete(sageResponse)
            }
        });

    } catch (error) {
        console.error('❌ Erreur Sage Histoart :', error.response ? error.response.data : error.message);
        console.error('❌ Stack trace:', error.stack);
        
        const fallbackResponses = [
            'Pardonnez-moi, je rencontre un problème technique momentané. Pourriez-vous reformuler votre question ? Je suis là pour vous accompagner dans votre apprentissage artistique.',
            'Une difficulté technique interrompt notre échange. Veuillez réessayer dans quelques instants. L\'histoire de l\'art a tant à nous révéler !',
            'Je rencontre une interruption de service temporaire. N\'hésitez pas à reposer votre question, je reste à votre disposition pour explorer ensemble les richesses artistiques.'
        ];
        
        const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        
        res.status(500).json({ 
            response: fallback,
            sage: 'Sage Histoart',
            error: 'Problème technique temporaire'
        });
    }
};

export function createChatbotController({ openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) } = {}) {

  async function generateResponse(req, res) {
    const { message, conversationHistory } = req.body ?? {};
    if (!message) {
      return res.status(400).json({ error: 'Un message est requis pour converser avec le Sage.' });
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          ...(conversationHistory ?? []).map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: message }
        ],
      });

      const text = completion.choices?.[0]?.message?.content ?? '';
      return res.status(200).json({ response: text, sage: 'Sage Histoart' });

    } catch (e) {
      return res.status(500).json({
        response: 'Je rencontre une difficulté technique momentanée. Veuillez réessayer.',
        sage: 'Sage Histoart',
        error: 'Problème technique temporaire',
        details: process.env.NODE_ENV === 'test' ? String(e) : undefined
      });
    }
  }

  return { generateResponse };
}