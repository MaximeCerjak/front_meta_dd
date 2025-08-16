import pkg from 'jsonwebtoken';
import {config} from "dotenv";

config();
const { verify } = pkg;

const authMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];

        try {
            const decoded = verify(token, process.env.JWT_SECRET);

            // Vérification si le rôle de l'utilisateur est dans les rôles autorisés
            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Accès refusé, rôle insuffisant' });
            }

            req.user = decoded
            next();
        } catch (error) {
            console.error(error)
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expiré' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token invalide' });
            }

            res.status(500).json({ message: 'Erreur d\'authentification', error: error.message });
        }
    };
};

export default authMiddleware;