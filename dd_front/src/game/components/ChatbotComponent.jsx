import React, { useState, useRef, useEffect } from 'react';
import ChatbotServiceBridge from '../services/ChatbotServiceBridge.js';

const ChatbotComponent = ({ isVisible, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '✨ SALUTATIONS, NOBLE VOYAGEUR ! JE SUIS LE SAGE HISTOART, GARDIEN DES CONNAISSANCES DE CE METAVERS. COMMENT PUIS-JE VOUS ÉCLAIRER ?',
      sender: 'sage',
      timestamp: Date.now()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
      inputRef.current.focus();
    }
  }, [isVisible]);

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: currentInput.trim().toUpperCase(),
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);

    try {
      const response = await ChatbotServiceBridge.sendMessage(userMessage.text);
      
      const sageMessage = {
        id: Date.now() + 1,
        text: response.toUpperCase(),
        sender: 'sage',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, sageMessage]);
    } catch (error) {
      console.error('Erreur chatbot:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'UNE PERTURBATION MYSTIQUE EMPÊCHE MA RÉPONSE... VEUILLEZ RÉESSAYER, NOBLE VOYAGEUR.',
        sender: 'sage',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
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

  const clearConversation = () => {
    ChatbotServiceBridge.clearHistory();
    
    setMessages([
      {
        id: Date.now(),
        text: 'SALUTATIONS, NOBLE VOYAGEUR ! QUE LES SECRETS DE L\'ART S\'OUVRENT À VOUS... QUELLE MERVEILLE ARTISTIQUE VOUS INTRIGUE ?',
        sender: 'sage',
        timestamp: Date.now()
      }
    ]);
  };

  if (!isVisible) return null;

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-container">
        {/* Header */}
        <div className="chatbot-header">
          <div className="header-border-top"></div>
          <div className="header-content">
            <div className="header-title">
              <span className="title-icon">🧙‍♂️</span>
              <span className="title-text">SAGE HISTOART</span>
            </div>
            <button 
              className="chatbot-close-btn"
              onClick={onClose}
              aria-label="Fermer le chat"
            >
              ✕
            </button>
          </div>
          <div className="header-border-bottom"></div>
        </div>

        {/* Zone des messages*/}
        <div className="chatbot-messages">
          <div className="messages-border">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`chatbot-message ${message.sender === 'sage' ? 'sage' : 'user'}`}
              >
                <div className="message-container">
                  <div className="message-border">
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-icon">
                          {message.sender === 'sage' ? '🧙' : '🧝'}
                        </span>
                        <span className="sender-name">
                          {message.sender === 'sage' ? 'SAGE HISTOART' : 'VOYAGEUR'}
                        </span>
                      </div>
                      <div className="message-text">{message.text}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="chatbot-message sage">
                <div className="message-container">
                  <div className="message-border">
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-icon">🧙</span>
                        <span className="sender-name">SAGE HISTOART</span>
                      </div>
                      <div className="typing-indicator">
                        <span className="typing-text">⚡ LE SAGE CONSULTE LES PARCHEMINS...</span>
                        <span className="typing-dots">...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Zone de saisie */}
        <div className="chatbot-input-area">
          <div className="input-border">
            <div className="input-container">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                onKeyDown={handleKeyDown}
                placeholder="TAPEZ VOTRE MESSAGE..."
                className="chatbot-input"
                maxLength={100}
                disabled={isTyping}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isTyping}
                className="send-btn"
                aria-label="Envoyer le message"
              >
                ⚡
              </button>
            </div>
            <div className="input-footer">
              <button 
                onClick={clearConversation}
                className="clear-btn"
                aria-label="Effacer la conversation"
              >
                🗑️ EFFACER
              </button>
              <div className="char-counter">{currentInput.length}/100</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .chatbot-overlay {
          position: fixed;
          top: 0;
          right: 0;
          width: 400px;
          height: 520px;
          z-index: 1000;
          margin: 24px;
          animation: slideInRight 0.5s ease-out;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .chatbot-container {
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

        .chatbot-header {
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

        .header-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .title-icon {
          font-size: 16px;
          text-shadow: 1px 1px 0px #000;
        }

        .title-text {
          color: #1a0f08;
          text-shadow: 1px 1px 0px #f4e06d;
          font-size: 8px;
        }

        .chatbot-close-btn {
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

        .chatbot-close-btn:hover {
          background: #a0522d;
        }

        .chatbot-close-btn:active {
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

        .chatbot-messages {
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
          gap: 8px;
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

        .chatbot-message {
          width: 100%;
        }

        .message-container {
          max-width: 85%;
        }

        .chatbot-message.sage .message-container {
          margin-right: auto;
        }

        .chatbot-message.user .message-container {
          margin-left: auto;
        }

        .message-border {
          background: #553c26;
          border: 2px solid #000;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .chatbot-message.sage .message-border {
          background: #553c26;
        }

        .chatbot-message.user .message-border {
          background: #2d4a2d;
          box-shadow: 
            inset 1px 1px 0px #3a5a3a,
            inset -1px -1px 0px #1e3a1e;
        }

        .message-content {
          padding: 8px;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .message-icon {
          font-size: 12px;
        }

        .sender-name {
          color: #d4af37;
          font-size: 6px;
          font-weight: normal;
        }

        .message-text {
          color: #e6d7c3;
          font-size: 7px;
          line-height: 1.6;
          word-wrap: break-word;
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .typing-text {
          color: #d4af37;
          font-size: 7px;
          font-style: italic;
        }

        .typing-dots {
          color: #d4af37;
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .chatbot-input-area {
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
          gap: 8px;
          margin-bottom: 8px;
        }

        .chatbot-input {
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

        .chatbot-input:focus {
          border-color: #d4af37;
          box-shadow: 
            inset 1px 1px 0px #1a0f08,
            inset -1px -1px 0px #4a3426,
            0 0 4px rgba(212, 175, 55, 0.5);
        }

        .chatbot-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #1a0f08;
          color: #8b4513;
        }

        .chatbot-input::placeholder {
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
          font-size: 12px;
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

        .input-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .clear-btn {
          background: #8b0000;
          color: #e6d7c3;
          border: 2px solid #000;
          padding: 4px 8px;
          cursor: pointer;
          font-family: inherit;
          font-size: 6px;
          box-shadow: 
            inset 1px 1px 0px #cd5c5c,
            inset -1px -1px 0px #5a0000;
        }

        .clear-btn:hover {
          background: #a52a2a;
        }

        .clear-btn:active {
          box-shadow: 
            inset -1px -1px 0px #cd5c5c,
            inset 1px 1px 0px #5a0000;
        }

        .char-counter {
          color: #8b7314;
          font-size: 6px;
        }

        /* Effet de scanlines rétro */
        .chatbot-container::after {
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
          .chatbot-overlay {
            width: 95vw;
            max-width: 400px;
            height: 90vh;
            max-height: 520px;
            margin: 12px;
          }
          
          .chatbot-container {
            font-size: 7px;
          }
          
          .message-text,
          .typing-text {
            font-size: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatbotComponent;