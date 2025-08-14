import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';
import LoginForm from './components/LoginForm'; // Formulaire de connexion
import SignupForm from './components/SignupForm'; // Formulaire d'inscription
import ChatbotComponent from './components/ChatbotComponent'; // Composant du chatbot

export const PhaserGame = forwardRef(({ currentActiveScene }, ref) => {
    const game = useRef();
    const [modalContent, setModalContent] = useState(null);
    const [chatbotVisible, setChatbotVisible] = useState(false);

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

        EventBus.on('trigger-login', handleLogin);
        EventBus.on('trigger-signup', handleSignup);
        EventBus.on('dialogue-end', closeModal);

        EventBus.on('chatbot-toggle', handleChatbotToggle);
        EventBus.on('chatbot-open', handleChatbotOpen);
        EventBus.on('chatbot-close', handleChatbotClose);

        return () => {
            EventBus.removeListener('current-scene-ready');
            EventBus.removeListener('trigger-login', handleLogin);
            EventBus.removeListener('trigger-signup', handleSignup);
            EventBus.removeListener('dialogue-end', closeModal);
            EventBus.removeListener('chatbot-toggle', handleChatbotToggle);
            EventBus.removeListener('chatbot-open', handleChatbotOpen);
            EventBus.removeListener('chatbot-close', handleChatbotClose);
        };
    }, [currentActiveScene, ref, chatbotVisible]);

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

            {/* Bouton flottant pour ouvrir le chatbot (optionnel) */}
            {!chatbotVisible && (
                <button 
                    onClick={() => {
                        setChatbotVisible(true);
                        EventBus.emit('chatbot-opened');
                    }}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: '#d4af37',
                        color: '#2c1810',
                        border: '3px solid #8b4513',
                        fontSize: '24px',
                        cursor: 'pointer',
                        zIndex: 999,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.background = '#f4d03f';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.background = '#d4af37';
                    }}
                    title="Ouvrir le chat avec le Sage"
                >
                    🧙‍♂️
                </button>
            )}
        </div>
    );
});

// Props definitions
PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func,
};
