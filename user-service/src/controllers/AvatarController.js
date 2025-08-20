import Avatar from '../models/Avatar.js';
import axios from 'axios';

// URL du Gateway Service
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://gateway-service:8080/api/assets';

export const getAvailableAvatars = async (req, res) => {
    try {
        console.log('Requête SQL générée par Sequelize :');
        const avatars = await Avatar.findAll({ logging: console.log }); // Log des requêtes SQL

        // Récupérer les fichiers de marche via le Gateway
        const walkFileIds = avatars.map(avatar => avatar.walkFileId).filter(id => id);
        const { data: walkFiles } = await axios.get(`${GATEWAY_URL}`, {
            params: { ids: walkFileIds.join(',') },
        });

        // Récupérer les fichiers d'idle'
        const idleFileIds = avatars.map(avatar => avatar.breatheFileId).filter(id => id);
        const { data: idleFiles } = await axios.get(`${GATEWAY_URL}`, {
            params: { ids: idleFileIds.join(',') },
        });

        // Associer les fichiers aux avatars
        const filesMap = [...walkFiles, ...idleFiles].reduce((acc, file) => {
            acc[file.id] = file;
            return acc;
        }, {});

        const avatarsWithFiles = avatars.map(avatar => ({
            ...avatar.toJSON(),
            file: filesMap[avatar.fileId] || null,
        }));

        res.json(avatarsWithFiles);
    } catch (error) {
        console.error('Erreur lors de la récupération des avatars:', error);
        res.status(500).json({ message: 'Error fetching avatars', error });
    }
};

export const getAvatarById = async (req, res) => {
    const { id } = req.params;
    try {
        const avatar = await Avatar.findByPk(id);
        if (!avatar) {
            return res.status(404).json({ message: 'Avatar not found' });
        }
        res.json(avatar);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching avatar', error });
    }
};

export const createAvatar = async (req, res) => {
    console.log('Request body received:', req.body);
    const { name, walkFileId, idleFileId } = req.body;
    try {
        const avatar = await Avatar.create({ name, walkFileId, idleFileId});
        res.status(201).json({ message: 'Avatar created', avatar });
    } catch (error) {
        console.error('Erreur lors de la création de l\'avatar :', error);
        res.status(500).json({ message: 'Error creating avatar', error });
    }
};

