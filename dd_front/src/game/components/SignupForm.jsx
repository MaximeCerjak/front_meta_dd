import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Form.css';
import ApiManager from '../../api/ApiManager';
import {EventBus} from '../EventBus';

const SignupForm = ({ onSignupSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await ApiManager.registerUser(username, email, password);
            console.log('Inscription réussie :', result);

            localStorage.setItem('token', result.token);
            EventBus.emit('player-logged-in');

            onSignupSuccess(); 
        } catch (error) {
            console.error('Erreur d\'inscription :', error.message);
            alert(error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Inscription</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">S&apos;inscrire</button>
                    <button type="button" onClick={() => onSignupSuccess()}>Annuler</button>
                </form>
            </div>
        </div>
    );
};

SignupForm.propTypes = {
    onSignupSuccess: PropTypes.func.isRequired,
};

export default SignupForm;
