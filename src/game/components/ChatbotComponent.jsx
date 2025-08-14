import React, { useState, useRef, useEffect } from 'react';
import ChatbotServiceBridge from '../services/ChatbotServiceBridge.js';

const ChatbotComponent = ({ isVisible, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "✨ Salutations, noble voyageur ! Je suis le Sage Histoart, gardien des connaissances de ce metavers. Comment puis-je vous éclairer ?",
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
      text: currentInput.trim(),
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
        text: response,
        sender: 'sage',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, sageMessage]);
    } catch (error) {
      console.error('Erreur chatbot:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Une perturbation mystique empêche ma réponse... Veuillez réessayer, noble voyageur.",
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
        text: "Salutations, noble voyageur ! Que les secrets de l'art s'ouvrent à vous... Quelle merveille artistique vous intrigue ?",
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
          <h3 className="chatbot-title">🧙‍♂️ SAGE HISTOART</h3>
          <button 
            className="chatbot-close-btn"
            onClick={onClose}
            aria-label="Fermer le chat"
          >
            ✕
          </button>
        </div>

        {/* Zone des messages */}
        <div className="chatbot-messages">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`chatbot-message ${message.sender === 'sage' ? 'sage' : 'user'}`}
            >
              <div className="message-content">
                <span className="message-icon">
                  {message.sender === 'sage' ? '🧙' : '🧝'}
                </span>
                <span className="message-text">{message.text}</span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="chatbot-message sage">
              <div className="message-content">
                <span className="message-icon">🧙</span>
                <span className="typing-indicator">
                  ⚡ Le Sage consulte les parchemins...
                </span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="chatbot-input-area">
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onKeyDown={handleKeyDown}
              placeholder="Tapez votre message..."
              className="chatbot-input"
              maxLength={150}
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
          <button 
            onClick={clearConversation}
            className="clear-btn"
            aria-label="Effacer la conversation"
          >
            🗑️ Effacer
          </button>
        </div>
      </div>

      <style jsx>{`
        .chatbot-overlay {
          position: fixed;
          top: 0;
          right: 0;
          width: 350px;
          height: 500px;
          z-index: 1000;
          margin: 20px;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
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
          background: #3a2918;
          border: 3px solid #d4af37;
          border-radius: 8px;
          box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          font-family: 'Courier New', monospace;
        }

        .chatbot-header {
          background: #d4af37;
          color: #2c1810;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #8b4513;
        }

        .chatbot-title {
          margin: 0;
          font-size: 14px;
          font-weight: bold;
        }

        .chatbot-close-btn {
          background: #8b4513;
          color: #d4af37;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .chatbot-close-btn:hover {
          background: #a0522d;
          transform: scale(1.1);
        }

        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #2c1810;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chatbot-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chatbot-messages::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        .chatbot-messages::-webkit-scrollbar-thumb {
          background: #8b4513;
          border-radius: 3px;
        }

        .chatbot-message {
          display: flex;
          align-items: flex-start;
        }

        .chatbot-message.sage {
          justify-content: flex-start;
        }

        .chatbot-message.user {
          justify-content: flex-end;
        }

        .message-content {
          max-width: 80%;
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 11px;
          line-height: 1.4;
          word-wrap: break-word;
          display: flex;
          align-items: flex-start;
          gap: 6px;
        }

        .chatbot-message.sage .message-content {
          background: #553c26;
          color: #e6d7c3;
        }

        .chatbot-message.user .message-content {
          background: #4a5568;
          color: #e6d7c3;
          flex-direction: row-reverse;
        }

        .message-icon {
          font-size: 12px;
          flex-shrink: 0;
        }

        .message-text {
          flex: 1;
        }

        .typing-indicator {
          font-style: italic;
          color: #d4af37;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .chatbot-input-area {
          background: #3a2918;
          border-top: 2px solid #8b4513;
          padding: 12px;
        }

        .input-container {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .chatbot-input {
          flex: 1;
          padding: 8px 12px;
          background: #2c1810;
          color: #e6d7c3;
          border: 2px solid #8b4513;
          border-radius: 4px;
          font-family: inherit;
          font-size: 11px;
          outline: none;
          transition: border-color 0.2s;
        }

        .chatbot-input:focus {
          border-color: #d4af37;
        }

        .chatbot-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .send-btn {
          background: #d4af37;
          color: #2c1810;
          border: 2px solid #8b4513;
          border-radius: 4px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
          min-width: 40px;
        }

        .send-btn:hover:not(:disabled) {
          background: #f4d03f;
          transform: scale(1.05);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .clear-btn {
          background: #8b4513;
          color: #e6d7c3;
          border: 1px solid #d4af37;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 10px;
          width: 100%;
          transition: all 0.2s;
        }

        .clear-btn:hover {
          background: #a0522d;
        }
      `}</style>
    </div>
  );
};

export default ChatbotComponent;