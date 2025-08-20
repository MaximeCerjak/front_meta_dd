import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';
import LoginForm from './components/LoginForm'; // Formulaire de connexion
import SignupForm from './components/SignupForm'; // Formulaire d'inscription
import ChatbotComponent from './components/ChatbotComponent'; // Composant du chatbot
import MultiplayerChatComponent from './components/MultiplayerChatComponent'; // Composant du chat multijoueur
import ExhibitionInterface from './components/ExhibitionInterface'; // Interface d'exposition

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

        const handleLogin = () => setModalContent('login');
        const handleSignup = () => setModalContent('signup');
        const closeModal = () => setModalContent(null);

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

        const handleMultiplayerChatToggle = () => {
            const newState = !multiplayerChatVisible;
            setMultiplayerChatVisible(newState);
            
            if (newState) {
                EventBus.emit('websocket-connect');
            }
        };
        
        const handleMultiplayerChatOpen = () => {
            setMultiplayerChatVisible(true);
            EventBus.emit('websocket-connect');
        };
        
        const handleMultiplayerChatClose = () => {
            setMultiplayerChatVisible(false);
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

                {/* Bouton Chat Multijoueur */}
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

                <ExhibitionInterface />
            </div>

            <style jsx>{`
                .floating-buttons {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    z-index: 999;
                }

                .floating-btn {
                    width: 64px;
                    height: 64px;
                    cursor: pointer;
                    font-size: 20px;
                    font-family: 'Press Start 2P', 'Courier New', monospace;
                    border: 4px solid #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    background: #d4af37;
                    box-shadow: 
                        inset 2px 2px 0px #f4e06d,
                        inset -2px -2px 0px #b8941f,
                        4px 4px 0px #000;
                    animation: floatIn 0.5s ease-out;
                    image-rendering: pixelated;
                }

                @keyframes floatIn {
                    from {
                        transform: translateX(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                .floating-btn:hover {
                    background: #f4e06d;
                    box-shadow: 
                        inset 2px 2px 0px #fff,
                        inset -2px -2px 0px #d4af37,
                        4px 4px 0px #000;
                    transform: scale(1.05);
                }

                .floating-btn:active {
                    box-shadow: 
                        inset -2px -2px 0px #f4e06d,
                        inset 2px 2px 0px #b8941f,
                        2px 2px 0px #000;
                    transform: translate(2px, 2px) scale(0.95);
                }

                .sage-btn {
                    background: #d4af37;
                    color: #1a0f08;
                    text-shadow: 1px 1px 0px #f4e06d;
                }

                .sage-btn:hover {
                    background: #f4e06d;
                    color: #1a0f08;
                }

                .multiplayer-btn {
                    background: #8b4513;
                    color: #f4e06d;
                    text-shadow: 1px 1px 0px #654321;
                    box-shadow: 
                        inset 2px 2px 0px #a0522d,
                        inset -2px -2px 0px #654321,
                        4px 4px 0px #000;
                }

                .multiplayer-btn:hover {
                    background: #a0522d;
                    box-shadow: 
                        inset 2px 2px 0px #cd853f,
                        inset -2px -2px 0px #8b4513,
                        4px 4px 0px #000;
                }

                .multiplayer-btn:active {
                    box-shadow: 
                        inset -2px -2px 0px #a0522d,
                        inset 2px 2px 0px #654321,
                        2px 2px 0px #000;
                }

                /* Effet de scanlines sur les boutons */
                .floating-btn::after {
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
                    .floating-buttons {
                        bottom: 80px;
                        right: 16px;
                        gap: 12px;
                    }
                    
                    .floating-btn {
                        width: 56px;
                        height: 56px;
                        font-size: 18px;
                    }
                    
                    .floating-btn[title]::before {
                        font-size: 5px;
                        padding: 4px 6px;
                        right: 64px;
                    }
                }

                @media (max-width: 480px) {
                    .floating-buttons {
                        bottom: 60px;
                        right: 12px;
                    }
                    
                    .floating-btn {
                        width: 48px;
                        height: 48px;
                        font-size: 16px;
                    }
                    
                    .floating-btn[title]::before {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
});

// Props definitions
PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func,
};