import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';
import LoginForm from './components/LoginForm'; // Formulaire de connexion
import SignupForm from './components/SignupForm'; // Formulaire d'inscription
import ChatbotComponent from './components/ChatbotComponent'; // Composant du chatbot
import MultiplayerChatComponent from './components/MultiplayerChatComponent'; // Composant du chat multijoueur

export const PhaserGame = forwardRef(({ currentActiveScene }, ref) => {
    const game = useRef();
    const [modalContent, setModalContent] = useState(null);
    const [chatbotVisible, setChatbotVisible] = useState(false);
    const [multiplayerChatVisible, setMultiplayerChatVisible] = useState(false);

    useLayoutEffect(() => {
        if (game.current === undefined) {
            game.current = StartGame('game-container');

            if (ref !== null) {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = undefined;
            }
        };
    }, [ref]);

    useEffect(() => {
        EventBus.on('current-scene-ready', (currentScene) => {
            if (currentActiveScene instanceof Function) {
                currentActiveScene(currentScene);
            }
            ref.current.scene = currentScene;
        });

        // Gérer l'affichage des modales
        const handleLogin = () => setModalContent('login');
        const handleSignup = () => setModalContent('signup');
        const closeModal = () => setModalContent(null);

        // Gérer l'affichage du chatbot
        const handleChatbotToggle = () => {
            const newState = !chatbotVisible;
            setChatbotVisible(newState);
            EventBus.emit(newState ? 'chatbot-opened' : 'chatbot-closed');
        };
        
        const handleChatbotOpen = () => {
            setChatbotVisible(true);
            EventBus.emit('chatbot-opened');
        };
        
        const handleChatbotClose = () => {
            setChatbotVisible(false);
            EventBus.emit('chatbot-closed');
        };

        // Gérer l'affichage du chat multijoueur
        const handleMultiplayerChatToggle = () => {
            const newState = !multiplayerChatVisible;
            setMultiplayerChatVisible(newState);
            
            if (newState) {
                // Initialiser la connexion WebSocket quand on ouvre le chat
                EventBus.emit('websocket-connect');
            }
        };
        
        const handleMultiplayerChatOpen = () => {
            setMultiplayerChatVisible(true);
            EventBus.emit('websocket-connect');
        };
        
        const handleMultiplayerChatClose = () => {
            setMultiplayerChatVisible(false);
            // Ne pas fermer la connexion WebSocket ici pour garder la connexion active
        };

        EventBus.on('trigger-login', handleLogin);
        EventBus.on('trigger-signup', handleSignup);
        EventBus.on('dialogue-end', closeModal);

        EventBus.on('chatbot-toggle', handleChatbotToggle);
        EventBus.on('chatbot-open', handleChatbotOpen);
        EventBus.on('chatbot-close', handleChatbotClose);

        EventBus.on('multiplayer-chat-toggle', handleMultiplayerChatToggle);
        EventBus.on('multiplayer-chat-open', handleMultiplayerChatOpen);
        EventBus.on('multiplayer-chat-close', handleMultiplayerChatClose);

        return () => {
            EventBus.removeListener('current-scene-ready');
            EventBus.removeListener('trigger-login', handleLogin);
            EventBus.removeListener('trigger-signup', handleSignup);
            EventBus.removeListener('dialogue-end', closeModal);
            EventBus.removeListener('chatbot-toggle', handleChatbotToggle);
            EventBus.removeListener('chatbot-open', handleChatbotOpen);
            EventBus.removeListener('chatbot-close', handleChatbotClose);
            EventBus.removeListener('multiplayer-chat-toggle', handleMultiplayerChatToggle);
            EventBus.removeListener('multiplayer-chat-open', handleMultiplayerChatOpen);
            EventBus.removeListener('multiplayer-chat-close', handleMultiplayerChatClose);
        };
    }, [currentActiveScene, ref, chatbotVisible, multiplayerChatVisible]);

    return (
        <div>
            {/* Conteneur du jeu */}
            <div id="game-container"></div>

            {/* Modale en overlay */}
            {modalContent && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {modalContent === 'login' && <LoginForm onLoginSuccess={() => EventBus.emit('dialogue-end')} />}
                        {modalContent === 'signup' && <SignupForm onSignupSuccess={() => EventBus.emit('dialogue-end')} />}
                        <button className="close-button" onClick={() => EventBus.emit('dialogue-end')}>✖</button>
                    </div>
                </div>
            )}

            {/* Chatbot Component */}
            <ChatbotComponent 
                isVisible={chatbotVisible}
                onClose={() => {
                    setChatbotVisible(false);
                    EventBus.emit('chatbot-closed');
                }}
            />

            {/* Chat multijoueur */}
            <MultiplayerChatComponent 
                isVisible={multiplayerChatVisible}
                onClose={() => {
                    setMultiplayerChatVisible(false);
                    EventBus.emit('multiplayer-chat-closed');
                }}
            />

           {/* Boutons flottants */}
            <div className="floating-buttons">
                {/* Bouton Sage Histoart */}
                {!chatbotVisible && (
                    <button 
                        onClick={() => {
                            setChatbotVisible(true);
                            EventBus.emit('chatbot-opened');
                        }}
                        className="floating-btn sage-btn"
                        title="Ouvrir le chat avec le Sage"
                    >
                        🧙‍♂️
                    </button>
                )}

                {/* NOUVEAU : Bouton Chat Multijoueur */}
                {!multiplayerChatVisible && (
                    <button 
                        onClick={() => {
                            setMultiplayerChatVisible(true);
                            EventBus.emit('websocket-connect');
                        }}
                        className="floating-btn multiplayer-btn"
                        title="Ouvrir le chat multijoueur"
                    >
                        💬
                    </button>
                )}
            </div>

            <style jsx>{`
                .floating-buttons {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    z-index: 999;
                }

                .floating-btn {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    border: 3px solid;
                    fontSize: 24px;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Courier New', monospace;
                    font-weight: bold;
                    position: relative;
                }

                .floating-btn::before {
                    content: '';
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);
                    animation: shimmer 3s infinite;
                    pointer-events: none;
                }

                @keyframes shimmer {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .sage-btn {
                    background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
                    color: #2c1810;
                    border-color: #8b4513;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                }

                .sage-btn:hover {
                    transform: scale(1.1);
                    background: linear-gradient(135deg, #f4d03f 0%, #d4af37 100%);
                    box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
                }

                .multiplayer-btn {
                    background: linear-gradient(135deg, #8b4513 0%, #d4af37 100%);
                    color: #2c1810;
                    border-color: #d4af37;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                }

                .multiplayer-btn:hover {
                    transform: scale(1.1);
                    background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
                    box-shadow: 0 6px 16px rgba(139, 69, 19, 0.4);
                }
            `}</style>
        </div>
    );
});

// Props definitions
PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func,
};