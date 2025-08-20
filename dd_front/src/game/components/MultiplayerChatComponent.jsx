import React, { useState, useRef, useEffect } from 'react';
import WebSocketBridge from '../services/WebSocketBridge';
import { EventBus } from '../EventBus'; 

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const handleWebSocketMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    const handleWebSocketConnected = (data) => {
      setIsConnected(true);
      setConnectedPlayers(data.connectedPlayers || []);
      setCurrentUser(data.currentUser || null);
    };

    const handleWebSocketDisconnected = () => {
      setIsConnected(false);
      setConnectedPlayers([]);
    };

    EventBus.on('websocket-message-received', handleWebSocketMessage);
    EventBus.on('websocket-connected', handleWebSocketConnected);
    EventBus.on('websocket-disconnected', handleWebSocketDisconnected);

    return () => {
      EventBus.off('websocket-message-received', handleWebSocketMessage);
      EventBus.off('websocket-connected', handleWebSocketConnected);
      EventBus.off('websocket-disconnected', handleWebSocketDisconnected);
    };
  }, [isVisible]);

  // Initialiser la connexion
  useEffect(() => {
    if (isVisible && !isConnected && !isConnecting) {
      initializeWebSocket();
    }
  }, [isVisible, isConnected, isConnecting]);

  const initializeWebSocket = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    
    try {
      const success = await WebSocketBridge.initialize();
      
      if (success) {
        const welcomeMessage = {
          id: 'welcome_' + Date.now(),
          type: 'system',
          content: '🌟 BIENVENUE DANS LA TAVERNE DES AVENTURIERS !',
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      } else {
        throw new Error('Échec de l\'initialisation');
      }
      
    } catch (error) {
      const errorMessage = {
        id: 'error_' + Date.now(),
        type: 'system',
        content: '⌐ IMPOSSIBLE DE SE CONNECTER À LA TAVERNE.',
        timestamp: new Date().toISOString()
      };
      setMessages([errorMessage]);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || !isConnected) return;

    try {
      const success = await WebSocketBridge.sendMessage(currentInput.trim().toUpperCase(), chatFilter);
      
      if (success) {
        setCurrentInput('');
      } else {
        throw new Error('Échec envoi message');
      }
      
    } catch (error) {
      const errorMessage = {
        id: 'error_' + Date.now(),
        type: 'system',
        content: '⌐ ERREUR LORS DE L\'ENVOI DU MESSAGE.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
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
        {/* Header Retro */}
        <div className="chat-header">
          <div className="header-border-top"></div>
          <div className="header-content">
            <div className="header-left">
              <div className="header-title">
                <span className="title-icon">⚔️</span>
                <span className="title-text">TAVERNE DES AVENTURIERS</span>
              </div>
              <div className="connection-status">
                <span className={`status-indicator ${isConnected ? 'connected' : isConnecting ? 'connecting' : 'disconnected'}`}></span>
                <span className="status-text">
                  {isConnected ? `${connectedPlayers.length} PRÉSENT(S)` : 
                   isConnecting ? 'CONNEXION...' : 'DÉCONNECTÉ'}
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
          <div className="header-border-bottom"></div>
        </div>

        {/* Filtres de chat */}
        <div className="chat-filters">
          <div className="filters-border">
            <button 
              className={`filter-btn ${chatFilter === 'global' ? 'active' : ''}`}
              onClick={() => setChatFilter('global')}
            >
              <span className="filter-icon">🌍</span>
              <span className="filter-text">TAVERNE ({getFilteredMessages().filter(m => m.type !== 'system').length})</span>
            </button>
            <button 
              className={`filter-btn ${chatFilter === 'scene' ? 'active' : ''}`}
              onClick={() => setChatFilter('scene')}
            >
              <span className="filter-icon">📍</span>
              <span className="filter-text">LOCAL ({getPlayersInCurrentScene().length})</span>
            </button>
          </div>
        </div>

        {/* Zone des messages */}
        <div className="chat-messages">
          <div className="messages-border">
            {!isConnected && !isConnecting && (
              <div className="empty-chat">
                <div className="empty-border">
                  <div className="empty-content">
                    <div className="empty-icon">🏰</div>
                    <div className="empty-text">CONNEXION À LA TAVERNE...</div>
                    <div className="empty-hint">PRÉPARATION DE VOTRE ARRIVÉE</div>
                  </div>
                </div>
              </div>
            )}

            {isConnecting && (
              <div className="empty-chat">
                <div className="empty-border">
                  <div className="empty-content">
                    <div className="empty-icon">⏳</div>
                    <div className="empty-text">ENTRÉE DANS LA TAVERNE...</div>
                    <div className="empty-hint">CHARGEMENT DES CONVERSATIONS</div>
                  </div>
                </div>
              </div>
            )}
            
            {getFilteredMessages().length === 0 && isConnected && (
              <div className="empty-chat">
                <div className="empty-border">
                  <div className="empty-content">
                    <div className="empty-icon">📜</div>
                    <div className="empty-text">LA TAVERNE EST SILENCIEUSE...</div>
                    <div className="empty-hint">SOYEZ LE PREMIER À PARLER !</div>
                  </div>
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
                  <div className="system-message-container">
                    <div className="system-message-border">
                      <div className="system-message-content">
                        <span className="system-text">{message.content}</span>
                        <span className="message-time">{formatTimestamp(message.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="user-message-container">
                    <div className="user-message-border">
                      <div className="user-message-content">
                        <div className="message-header">
                          <span className="user-avatar">{message.senderAvatar || '👤'}</span>
                          <span className="user-name">{message.senderName}</span>
                          <span className="message-time">{formatTimestamp(message.timestamp)}</span>
                          {message.scene && chatFilter === 'global' && (
                            <span className="message-scene">📍 {message.scene}</span>
                          )}
                        </div>
                        <div className="message-content-text">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Zone de saisie */}
        <div className="chat-input-area">
          <div className="input-border">
            <div className="input-container">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                onKeyDown={handleKeyDown}
                placeholder={
                  isConnected 
                    ? `PARLEZ AUX AVENTURIERS ${chatFilter === 'scene' ? 'DE CETTE ZONE' : 'DE LA TAVERNE'}...`
                    : isConnecting 
                      ? 'CONNEXION EN COURS...'
                      : 'EN ATTENTE DE CONNEXION...'
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
              >
                📜
              </button>
            </div>
            <div className="chat-info">
              <span className="input-counter">{currentInput.length}/200</span>
              {currentUser && (
                <span className="current-scene">
                  📍 ZONE: <strong>{currentUser.scene}</strong>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .multiplayer-chat-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 420px;
          height: 580px;
          z-index: 1000;
          margin: 24px;
          animation: slideInLeft 0.5s ease-out;
        }

        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .multiplayer-chat-container {
          width: 100%;
          height: 100%;
          background: #2d1b0e;
          border: 4px solid #000;
          box-shadow: 
            inset 2px 2px 0px #4a3426,
            inset -2px -2px 0px #1a0f08,
            4px 4px 0px #000;
          display: flex;
          flex-direction: column;
          font-family: 'Press Start 2P', 'Courier New', monospace;
          font-size: 8px;
          line-height: 1.4;
          image-rendering: pixelated;
        }

        .chat-header {
          background: #d4af37;
          border-bottom: 3px solid #000;
        }

        .header-border-top {
          height: 3px;
          background: repeating-linear-gradient(
            90deg,
            #f4e06d 0px,
            #f4e06d 3px,
            #b8941f 3px,
            #b8941f 6px
          );
        }

        .header-content {
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(180deg, #f4e06d 0%, #d4af37 50%, #b8941f 100%);
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .title-icon {
          font-size: 12px;
        }

        .title-text {
          color: #1a0f08;
          text-shadow: 1px 1px 0px #f4e06d;
          font-size: 8px;
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 6px;
          font-style: italic;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          background: #8b4513;
          border: 1px solid #000;
        }

        .status-indicator.connected {
          background: #228b22;
          animation: blink 2s infinite;
        }

        .status-indicator.connecting {
          background: #f39c12;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .status-text {
          color: #1a0f08;
        }

        .chat-close-btn {
          background: #8b4513;
          color: #f4e06d;
          border: 2px solid #000;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-family: inherit;
          font-size: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
        }

        .chat-close-btn:hover {
          background: #a0522d;
        }

        .chat-close-btn:active {
          box-shadow: 
            inset -1px -1px 0px #a0522d,
            inset 1px 1px 0px #654321;
        }

        .header-border-bottom {
          height: 3px;
          background: repeating-linear-gradient(
            90deg,
            #b8941f 0px,
            #b8941f 3px,
            #8b7314 3px,
            #8b7314 6px
          );
        }

        .chat-filters {
          background: #3a2918;
          border-bottom: 3px solid #000;
          padding: 8px;
        }

        .filters-border {
          border: 2px solid #553c26;
          background: #2d1b0e;
          padding: 6px;
          display: flex;
          gap: 4px;
          box-shadow: 
            inset 1px 1px 0px #4a3426,
            inset -1px -1px 0px #1a0f08;
        }

        .filter-btn {
          background: #8b4513;
          color: #e6d7c3;
          border: 2px solid #000;
          padding: 4px 8px;
          cursor: pointer;
          font-family: inherit;
          font-size: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
          flex: 1;
          justify-content: center;
        }

        .filter-btn.active {
          background: #d4af37;
          color: #1a0f08;
          box-shadow: 
            inset -1px -1px 0px #f4e06d,
            inset 1px 1px 0px #b8941f;
        }

        .filter-btn:hover:not(.active) {
          background: #a0522d;
        }

        .filter-icon {
          font-size: 8px;
        }

        .filter-text {
          font-size: 5px;
        }

        .chat-messages {
          flex: 1;
          overflow: hidden;
          background: #2d1b0e;
          padding: 8px;
        }

        .messages-border {
          border: 2px solid #553c26;
          background: #3a2918;
          height: 100%;
          overflow-y: auto;
          padding: 8px;
          box-shadow: 
            inset 1px 1px 0px #4a3426,
            inset -1px -1px 0px #2d1b0e;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .messages-border::-webkit-scrollbar {
          width: 12px;
        }

        .messages-border::-webkit-scrollbar-track {
          background: #1a0f08;
          border: 2px solid #000;
        }

        .messages-border::-webkit-scrollbar-thumb {
          background: #8b4513;
          border: 2px solid #000;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
        }

        .empty-chat {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        .empty-border {
          background: #553c26;
          border: 2px solid #000;
          padding: 16px;
          text-align: center;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .empty-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .empty-icon {
          font-size: 24px;
        }

        .empty-text {
          color: #d4af37;
          font-size: 7px;
        }

        .empty-hint {
          color: #8b7314;
          font-size: 6px;
        }

        .system-message-container {
          display: flex;
          justify-content: center;
        }

        .system-message-border {
          background: #8b4513;
          border: 2px solid #000;
          padding: 6px 8px;
          max-width: 80%;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
        }

        .system-message-content {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
        }

        .system-text {
          color: #f4e06d;
          font-size: 6px;
          font-weight: normal;
          text-align: center;
        }

        .user-message-container {
          width: 100%;
        }

        .chat-message.own .user-message-container {
          display: flex;
          justify-content: flex-end;
        }

        .chat-message.other .user-message-container {
          display: flex;
          justify-content: flex-start;
        }

        .user-message-border {
          background: #553c26;
          border: 2px solid #000;
          padding: 6px;
          max-width: 75%;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .chat-message.own .user-message-border {
          background: #2d4a2d;
          box-shadow: 
            inset 1px 1px 0px #3a5a3a,
            inset -1px -1px 0px #1e3a1e;
        }

        .user-message-content {
          
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 4px;
          font-size: 6px;
        }

        .user-avatar {
          font-size: 10px;
        }

        .user-name {
          color: #d4af37;
          font-weight: normal;
        }

        .message-time {
          margin-left: auto;
          font-size: 5px;
          font-style: italic;
          opacity: 0.8;
          color: #8b7314;
        }

        .message-scene {
          font-size: 5px;
          color: #8b7314;
        }

        .message-content-text {
          color: #e6d7c3;
          font-size: 7px;
          line-height: 1.6;
          word-wrap: break-word;
        }

        .chat-input-area {
          background: #2d1b0e;
          border-top: 3px solid #000;
          padding: 8px;
        }

        .input-border {
          border: 2px solid #553c26;
          background: #3a2918;
          padding: 8px;
          box-shadow: 
            inset 1px 1px 0px #4a3426,
            inset -1px -1px 0px #2d1b0e;
        }

        .input-container {
          display: flex;
          gap: 6px;
          margin-bottom: 6px;
        }

        .chat-input {
          flex: 1;
          padding: 6px 8px;
          background: #2d1b0e;
          color: #e6d7c3;
          border: 2px solid #000;
          font-family: inherit;
          font-size: 7px;
          outline: none;
          box-shadow: 
            inset 1px 1px 0px #1a0f08,
            inset -1px -1px 0px #4a3426;
        }

        .chat-input:focus {
          border-color: #d4af37;
          box-shadow: 
            inset 1px 1px 0px #1a0f08,
            inset -1px -1px 0px #4a3426,
            0 0 4px rgba(212, 175, 55, 0.5);
        }

        .chat-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #1a0f08;
          color: #8b4513;
        }

        .chat-input::placeholder {
          color: #8b4513;
          font-style: italic;
        }

        .send-btn {
          background: #228b22;
          color: #e6d7c3;
          border: 2px solid #000;
          padding: 6px 10px;
          cursor: pointer;
          font-family: inherit;
          font-size: 10px;
          box-shadow: 
            inset 1px 1px 0px #32cd32,
            inset -1px -1px 0px #006400;
          min-width: 36px;
        }

        .send-btn:hover:not(:disabled) {
          background: #32cd32;
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #8b4513;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
        }

        .send-btn:active:not(:disabled) {
          box-shadow: 
            inset -1px -1px 0px #32cd32,
            inset 1px 1px 0px #006400;
        }

        .chat-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 6px;
          color: #8b7314;
        }

        .current-scene strong {
          color: #d4af37;
        }

        .multiplayer-chat-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          );
          pointer-events: none;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .multiplayer-chat-overlay {
            width: 95vw;
            max-width: 420px;
            height: 85vh;
            max-height: 580px;
            margin: 12px;
          }
          
          .multiplayer-chat-container {
            font-size: 7px;
          }
          
          .filter-text {
            font-size: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default MultiplayerChatComponent;