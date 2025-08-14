// src/game/components/MultiplayerChatComponent.jsx 
import React, { useState, useRef, useEffect } from 'react';
import WebSocketBridge from '../services/WebSocketBridge'; 

const MultiplayerChatComponent = ({ isVisible, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chatFilter, setChatFilter] = useState('global');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Références pour gérer les timeouts

  // Scroll automatique vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus sur l'input quand le chat s'ouvre
  useEffect(() => {
    if (isVisible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isVisible]);

  // Initialiser la connexion quand le chat s'ouvre
  useEffect(() => {
    if (isVisible && !isConnected && !isConnecting) {
      initializeWebSocket();
    }
  }, [isVisible]);

  // Fonction d'initialisation WebSocket (similaire au pattern ChatbotComponent)
  const initializeWebSocket = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    
    try {
      console.log('MultiplayerChat - Initialisation WebSocket...');
      
      // Initialiser le bridge directement
      await WebSocketBridge.initialize();
      
      // Simuler une connexion réussie avec des données
      const mockConnectionData = {
        connectedPlayers: WebSocketBridge.getConnectedPlayers(),
        currentUser: {
          id: 'user_' + Date.now(),
          username: localStorage.getItem('username') || 'Joueur',
          avatar: '🧝',
          status: 'online',
          scene: 'Intro'
        }
      };
      
      setIsConnected(true);
      setConnectedPlayers(mockConnectionData.connectedPlayers);
      setCurrentUser(mockConnectionData.currentUser);
      
      // Message de bienvenue
      const welcomeMessage = {
        id: 'welcome_' + Date.now(),
        type: 'system',
        content: `🌟 Bienvenue dans la Taverne des Aventuriers ! ${mockConnectionData.connectedPlayers.length} voyageur(s) présent(s).`,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      
      // Démarrer la simulation de messages
      startMessageSimulation();
      
      console.log('MultiplayerChat - Connexion établie avec succès');
      
    } catch (error) {
      console.error('MultiplayerChat - Erreur de connexion:', error);
      
      const errorMessage = {
        id: 'error_' + Date.now(),
        type: 'system',
        content: '❌ Impossible de se connecter à la taverne. Réessayez plus tard.',
        timestamp: new Date().toISOString()
      };
      setMessages([errorMessage]);
    } finally {
      setIsConnecting(false);
    }
  };

  // Références pour gérer les timeouts
  const simulationTimeouts = useRef([]);
  const continuousSimulation = useRef(null);

  // Nettoyer les timeouts au démontage ou fermeture
  useEffect(() => {
    return () => {
      // Nettoyer tous les timeouts
      simulationTimeouts.current.forEach(timeout => clearTimeout(timeout));
      simulationTimeouts.current = [];
      
      if (continuousSimulation.current) {
        clearInterval(continuousSimulation.current);
        continuousSimulation.current = null;
      }
    };
  }, []);

  // Nettoyer si le chat se ferme
  useEffect(() => {
    if (!isVisible) {
      simulationTimeouts.current.forEach(timeout => clearTimeout(timeout));
      simulationTimeouts.current = [];
      
      if (continuousSimulation.current) {
        clearInterval(continuousSimulation.current);
        continuousSimulation.current = null;
      }
    }
  }, [isVisible]);

  // Simulation de messages automatiques (directement dans le composant)
  const startMessageSimulation = () => {
    console.log('MultiplayerChat - Démarrage de la simulation de messages');
    
    const initialMessages = [
      { text: "Salut ! Quelqu'un a vu la nouvelle exposition ?", delay: 3000 },
      { text: "Cette œuvre de Van Gogh est magnifique !", delay: 8000 },
      { text: "Est-ce que quelqu'un peut m'aider à trouver la salle Renaissance ?", delay: 15000 },
      { text: "J'adore cette visite virtuelle du musée !", delay: 22000 },
      { text: "Wow, cette sculpture interactive est incroyable", delay: 30000 }
    ];

    const players = [
      { name: 'Alice', avatar: '🎨', scene: 'Museumreception' },
      { name: 'Bob', avatar: '🖼️', scene: 'Exhibitionroom' },
      { name: 'Charlie', avatar: '🏛️', scene: 'Welcomeisle' },
      { name: 'Diana', avatar: '🎭', scene: 'Intro' },
      { name: 'Eve', avatar: '🖌️', scene: 'Sandbox' }
    ];

    const continuousMessages = [
      "Quelqu'un connaît l'histoire de ce tableau ?",
      "Cette exposition temporaire vaut vraiment le détour !",
      "Les détails de cette fresque sont saisissants",
      "Je recommande vraiment cette section égyptienne",
      "Cette reconstitution 3D est bluffante",
      "Le guide audio est vraiment bien fait",
      "Cette peinture me rappelle mes cours d'art",
      "Qui veut explorer la galerie moderne ensemble ?",
      "Merci pour l'explication, très intéressant !",
      "Cette architecture gothique est impressionnante"
    ];

    // Messages initiaux programmés
    initialMessages.forEach((msgData, index) => {
      const timeout = setTimeout(() => {
        if (isConnected && isVisible) {
          const randomPlayer = players[Math.floor(Math.random() * players.length)];
          
          const simulatedMessage = {
            id: 'sim_' + Date.now() + '_' + index,
            senderId: randomPlayer.name.toLowerCase() + '_' + Math.random(),
            senderName: randomPlayer.name,
            senderAvatar: randomPlayer.avatar,
            content: msgData.text,
            type: 'global',
            scene: randomPlayer.scene,
            timestamp: new Date().toISOString(),
            isOwn: false
          };
          
          console.log('MultiplayerChat - Message simulé envoyé:', simulatedMessage.content);
          setMessages(prev => [...prev, simulatedMessage]);
        }
      }, msgData.delay);
      
      // Stocker le timeout pour pouvoir le nettoyer
      simulationTimeouts.current.push(timeout);
    });

    // Simulation continue après les messages initiaux
    const startContinuousSimulation = () => {
      continuousSimulation.current = setInterval(() => {
        if (isConnected && isVisible && Math.random() > 0.6) { // 40% de chance
          const randomPlayer = players[Math.floor(Math.random() * players.length)];
          const randomMessage = continuousMessages[Math.floor(Math.random() * continuousMessages.length)];
          
          const simulatedMessage = {
            id: 'continuous_' + Date.now() + '_' + Math.random(),
            senderId: randomPlayer.name.toLowerCase() + '_continuous',
            senderName: randomPlayer.name,
            senderAvatar: randomPlayer.avatar,
            content: randomMessage,
            type: 'global',
            scene: randomPlayer.scene,
            timestamp: new Date().toISOString(),
            isOwn: false
          };
          
          console.log('MultiplayerChat - Message continu envoyé:', simulatedMessage.content);
          setMessages(prev => [...prev, simulatedMessage]);
        }
      }, 15000 + Math.random() * 20000); // Entre 15 et 35 secondes
    };

    // Démarrer la simulation continue après 35 secondes
    const continuousTimeout = setTimeout(startContinuousSimulation, 35000);
    simulationTimeouts.current.push(continuousTimeout);
  };

  // Envoyer un message
  const handleSendMessage = async () => {
    if (!currentInput.trim() || !isConnected) return;

    try {
      // Créer le message utilisateur
      const userMessage = {
        id: 'user_' + Date.now(),
        senderId: currentUser.id,
        senderName: currentUser.username,
        senderAvatar: currentUser.avatar,
        content: currentInput.trim(),
        type: chatFilter,
        scene: currentUser.scene,
        timestamp: new Date().toISOString(),
        isOwn: true
      };

      // Ajouter à la liste des messages
      setMessages(prev => [...prev, userMessage]);
      
      // Vider l'input
      setCurrentInput('');
      
      // Simuler une réponse après un délai (comme le ChatbotComponent)
      simulateResponse(userMessage);
      
      console.log('Message envoyé:', userMessage);
      
    } catch (error) {
      console.error('Erreur envoi message:', error);
      
      const errorMessage = {
        id: 'error_' + Date.now(),
        type: 'system',
        content: '❌ Erreur lors de l\'envoi du message.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // Simuler une réponse (comme le pattern du ChatbotComponent)
  const simulateResponse = (originalMessage) => {
    // 70% de chance d'avoir une réponse
    if (Math.random() > 0.3) {
      const players = [
        { name: 'Alice', avatar: '🎨', scene: 'Museumreception' },
        { name: 'Bob', avatar: '🖼️', scene: 'Exhibitionroom' },
        { name: 'Charlie', avatar: '🏛️', scene: 'Welcomeisle' },
        { name: 'Diana', avatar: '🎭', scene: 'Intro' }
      ];
      
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      
      setTimeout(() => {
        const response = {
          id: 'response_' + Date.now(),
          senderId: randomPlayer.name.toLowerCase() + '_response',
          senderName: randomPlayer.name,
          senderAvatar: randomPlayer.avatar,
          content: generateContextualResponse(originalMessage.content),
          type: originalMessage.type,
          scene: randomPlayer.scene,
          timestamp: new Date().toISOString(),
          isOwn: false
        };

        setMessages(prev => [...prev, response]);
      }, Math.random() * 3000 + 1000); // 1-4 secondes
    }
  };

  // Générer une réponse contextuelle
  const generateContextualResponse = (originalContent) => {
    const responses = [
      "Tout à fait d'accord ! 👍",
      "Intéressant point de vue 🤔",
      "Merci pour l'info !",
      "Je vais aller voir ça",
      "Excellente question",
      "Ça me donne envie d'en savoir plus",
      "Très belle découverte !",
      "Je pense la même chose",
      "Bonne suggestion 👍",
      "Merci du partage !"
    ];

    const lowerContent = originalContent.toLowerCase();
    
    if (lowerContent.includes('bonjour') || lowerContent.includes('salut')) {
      return Math.random() > 0.5 ? 'Salut ! Bienvenue 👋' : 'Bonjour ! Content de te voir ici';
    }
    
    if (lowerContent.includes('aide') || lowerContent.includes('?')) {
      return Math.random() > 0.5 ? 'Je peux t\'aider si tu veux' : 'Quelle est ta question exactement ?';
    }
    
    if (lowerContent.includes('merci')) {
      return Math.random() > 0.5 ? 'De rien ! 😊' : 'Avec plaisir !';
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    e.stopPropagation();
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getFilteredMessages = () => {
    if (chatFilter === 'global') {
      return messages;
    } else if (chatFilter === 'scene' && currentUser) {
      return messages.filter(msg => 
        msg.type === 'system' || 
        msg.scene === currentUser.scene || 
        msg.isOwn
      );
    }
    return messages;
  };

  const getPlayersInCurrentScene = () => {
    if (!currentUser) return [];
    return connectedPlayers.filter(player => player.scene === currentUser.scene);
  };

  if (!isVisible) return null;

  return (
    <div className="multiplayer-chat-overlay">
      <div className="multiplayer-chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="header-left">
            <h3 className="chat-title">⚔️ TAVERNE DES AVENTURIERS</h3>
            <div className="connection-status">
              <span className={`status-indicator ${isConnected ? 'connected' : isConnecting ? 'connecting' : 'disconnected'}`}></span>
              <span className="status-text">
                {isConnected ? `${connectedPlayers.length} présent(s)` : 
                 isConnecting ? 'Connexion...' : 'Déconnecté'}
              </span>
            </div>
          </div>
          <button 
            className="chat-close-btn"
            onClick={onClose}
            aria-label="Fermer le chat"
          >
            ✕
          </button>
        </div>

        {/* Filtres de chat */}
        <div className="chat-filters">
          <button 
            className={`filter-btn ${chatFilter === 'global' ? 'active' : ''}`}
            onClick={() => setChatFilter('global')}
          >
            🌍 Taverne ({getFilteredMessages().filter(m => m.type !== 'system').length})
          </button>
          <button 
            className={`filter-btn ${chatFilter === 'scene' ? 'active' : ''}`}
            onClick={() => setChatFilter('scene')}
          >
            📍 Local ({getPlayersInCurrentScene().length})
          </button>
        </div>

        {/* Zone des messages */}
        <div className="chat-messages">
          {!isConnected && !isConnecting && (
            <div className="empty-chat">
              <div className="empty-message">
                🏰 Connexion à la taverne...
                <br />
                <span>Préparation de votre arrivée</span>
              </div>
            </div>
          )}

          {isConnecting && (
            <div className="empty-chat">
              <div className="empty-message">
                ⏳ Entrée dans la taverne...
                <br />
                <span>Chargement des conversations</span>
              </div>
            </div>
          )}
          
          {getFilteredMessages().length === 0 && isConnected && (
            <div className="empty-chat">
              <div className="empty-message">
                📜 La taverne est silencieuse...
                <br />
                <span>Soyez le premier à parler !</span>
              </div>
            </div>
          )}
          
          {getFilteredMessages().map((message) => (
            <div 
              key={message.id}
              className={`chat-message ${
                message.type === 'system' ? 'system' : 
                message.isOwn ? 'own' : 'other'
              }`}
            >
              {message.type === 'system' ? (
                <div className="system-message">
                  <span className="system-text">{message.content}</span>
                  <span className="message-time">{formatTimestamp(message.timestamp)}</span>
                </div>
              ) : (
                <div className="user-message">
                  <div className="message-header">
                    <span className="user-avatar">{message.senderAvatar || '👤'}</span>
                    <span className="user-name">{message.senderName}</span>
                    <span className="message-time">{formatTimestamp(message.timestamp)}</span>
                    {message.scene && chatFilter === 'global' && (
                      <span className="message-scene">📍 {message.scene}</span>
                    )}
                  </div>
                  <div className="message-content">
                    {message.content}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="chat-input-area">
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onKeyDown={handleKeyDown}
              placeholder={
                isConnected 
                  ? `Parlez aux aventuriers ${chatFilter === 'scene' ? 'de cette zone' : 'de la taverne'}...`
                  : isConnecting 
                    ? "Connexion en cours..."
                    : "En attente de connexion..."
              }
              className="chat-input"
              maxLength={200}
              disabled={!isConnected}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || !isConnected}
              className="send-btn"
              aria-label="Envoyer le message"
              title="Envoyer votre message"
            >
              📜
            </button>
          </div>
          <div className="chat-info">
            <span className="input-counter">{currentInput.length}/200</span>
            {currentUser && (
              <span className="current-scene">
                📍 Zone actuelle: <strong>{currentUser.scene}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Styles identiques à la version précédente */}
      <style jsx>{`
        .multiplayer-chat-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 400px;
          height: 600px;
          z-index: 1000;
          margin: 20px;
          animation: slideInLeft 0.3s ease-out;
        }

        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .multiplayer-chat-container {
          width: 100%; height: 100%; background: #3a2918; border: 3px solid #d4af37;
          border-radius: 8px; box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.4);
          display: flex; flex-direction: column; font-family: 'Courier New', monospace; position: relative;
        }

        .multiplayer-chat-container::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(139, 69, 19, 0.1) 100%);
          border-radius: 5px; pointer-events: none;
        }

        .chat-header {
          background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%); color: #2c1810;
          padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;
          border-bottom: 2px solid #8b4513; position: relative; z-index: 1;
        }

        .header-left { display: flex; flex-direction: column; gap: 4px; }
        .chat-title { margin: 0; font-size: 14px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3); }
        .connection-status { display: flex; align-items: center; gap: 6px; font-size: 11px; font-style: italic; }

        .status-indicator {
          width: 8px; height: 8px; border-radius: 50%; background: #8b4513; box-shadow: 0 0 4px rgba(0,0,0,0.3);
        }
        .status-indicator.connected { background: #228b22; box-shadow: 0 0 6px rgba(34, 139, 34, 0.5); }
        .status-indicator.connecting { background: #f39c12; box-shadow: 0 0 6px rgba(243, 156, 18, 0.5); }

        .chat-close-btn {
          background: #8b4513; color: #d4af37; border: none; width: 24px; height: 24px;
          border-radius: 50%; cursor: pointer; font-size: 12px; display: flex;
          align-items: center; justify-content: center; transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .chat-close-btn:hover { background: #a0522d; transform: scale(1.1); }

        .chat-filters {
          background: linear-gradient(135deg, #553c26 0%, #3a2918 100%);
          padding: 8px 16px; display: flex; gap: 8px; border-bottom: 1px solid #8b4513; z-index: 1;
        }

        .filter-btn {
          background: #8b4513; color: #e6d7c3; border: 2px solid #d4af37;
          padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;
          font-family: inherit; transition: all 0.2s; font-weight: bold;
        }
        .filter-btn.active { background: #d4af37; color: #2c1810; }
        .filter-btn:hover:not(.active) { background: #a0522d; transform: translateY(-1px); }

        .chat-messages {
          flex: 1; overflow-y: auto; padding: 12px;
          background: linear-gradient(135deg, #2c1810 0%, #1a1a1a 100%);
          display: flex; flex-direction: column; gap: 8px; z-index: 1;
        }

        .empty-chat { display: flex; justify-content: center; align-items: center; height: 100%; text-align: center; }
        .empty-message { color: #8b4513; font-style: italic; font-size: 14px; line-height: 1.6; }
        .empty-message span { font-size: 12px; opacity: 0.8; }

        .chat-messages::-webkit-scrollbar { width: 8px; }
        .chat-messages::-webkit-scrollbar-track { background: #3a2918; border-radius: 4px; }
        .chat-messages::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #8b4513 0%, #d4af37 100%);
          border-radius: 4px; border: 1px solid #3a2918;
        }

        .system-message {
          display: flex; align-items: center; gap: 6px; padding: 8px 12px;
          background: linear-gradient(135deg, #8b4513 0%, #d4af37 100%);
          color: #2c1810; border-radius: 6px; font-size: 11px;
          justify-content: center; border: 1px solid #d4af37; font-weight: bold;
        }

        .user-message {
          background: linear-gradient(135deg, #553c26 0%, #3a2918 100%);
          border: 2px solid #8b4513; border-radius: 8px; padding: 8px 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3); position: relative;
        }

        .chat-message.own .user-message {
          border-color: #228b22; margin-left: 20px;
          background: linear-gradient(135deg, #2d4a2d 0%, #1e3a1e 100%);
        }
        .chat-message.other .user-message { border-color: #d4af37; margin-right: 20px; }

        .message-header {
          display: flex; align-items: center; gap: 6px; margin-bottom: 4px;
          font-size: 11px; color: #d4af37; z-index: 1;
        }
        .user-name { font-weight: bold; color: #e6d7c3; }
        .message-time { margin-left: auto; font-size: 10px; font-style: italic; opacity: 0.8; }
        .message-content { font-size: 12px; line-height: 1.4; color: #e6d7c3; word-wrap: break-word; z-index: 1; }

        .chat-input-area {
          background: linear-gradient(135deg, #3a2918 0%, #2c1810 100%);
          border-top: 2px solid #8b4513; padding: 12px; z-index: 1;
        }

        .input-container { display: flex; gap: 8px; margin-bottom: 6px; }

        .chat-input {
          flex: 1; padding: 8px 12px; background: #2c1810; color: #e6d7c3;
          border: 2px solid #8b4513; border-radius: 4px; font-family: inherit;
          font-size: 12px; outline: none; transition: all 0.2s;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
        }
        .chat-input:focus { border-color: #d4af37; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3), 0 0 8px rgba(212, 175, 55, 0.3); }
        .chat-input:disabled { opacity: 0.6; cursor: not-allowed; background: #1a1a1a; color: #8b4513; }
        .chat-input::placeholder { color: #8b4513; font-style: italic; }

        .send-btn {
          background: linear-gradient(135deg, #228b22 0%, #32cd32 100%);
          color: white; border: 2px solid #228b22; border-radius: 4px;
          padding: 8px 12px; cursor: pointer; font-size: 14px; font-family: inherit;
          font-weight: bold; transition: all 0.2s; min-width: 40px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .send-btn:hover:not(:disabled) { background: linear-gradient(135deg, #32cd32 0%, #228b22 100%); transform: translateY(-1px); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #8b4513; border-color: #8b4513; }

        .chat-info {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 10px; color: #d4af37; font-style: italic;
        }
        .current-scene strong { color: #d4af37; }
      `}</style>
    </div>
  );
};

export default MultiplayerChatComponent;