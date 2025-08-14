import { useState } from 'react';
import PropTypes from 'prop-types';
import './Form.css';
import ApiManager from '../../api/ApiManager';
import {EventBus} from '../EventBus';

const LoginForm = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await ApiManager.loginUser(username, password);
            console.log('Connexion réussie :', result);

            localStorage.setItem('token', result.token);

            EventBus.emit('player-logged-in');
            onLoginSuccess(); 
        } catch (error) {
            console.error('Erreur de connexion :', error.message);
            alert(error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Connexion</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Se connecter</button>
                    <button type="button" onClick={() => onLoginSuccess()}>Annuler</button>
                </form>
            </div>
        </div>
    );
};

LoginForm.propTypes = {
    onLoginSuccess: PropTypes.func.isRequired,
};

export default LoginForm;
