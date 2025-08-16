import { getAssetById, uploadAvatar } from '../services/GatewayAssetService.js';
import { postAvatar, getAvatarById } from '../services/GatewayUserService.js';

export const createAvatar = async (req, res) => {
    try {
        const avatar = await uploadAvatar(req.file);
        res.status(201).json(avatar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addAvatar = async (req, res) => {
    try {
        const avatar = await postAvatar(req.body);
        res.status(201).json(avatar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAvatar = async (id) => {
    console.log("Controller getAvatarById");
    try {
        const avatar = await getAvatarById(id);

        if (!avatar) {
            console.error("Erreur avatar getAssetById");
            return null;
        } else {
            console.log("Retour avatar getAssetById : ", avatar);
        }
        
        const walkSprite = await getAssetById(avatar.walkFileId);
        const idleSprite = await getAssetById(avatar.idleFileId);

        const response = {
            ...avatar,
            walkSprite : {
                name: walkSprite.name,
                path: walkSprite.path,
                dimensions: walkSprite.dimensions,
                frameWidth: walkSprite.frameWidth || 64,
                frameHeight: walkSprite.frameHeight || 64
            },
            idleSprite : {
                name: idleSprite.name,
                path: idleSprite.path,
                dimensions: idleSprite.dimensions,
                frameWidth: idleSprite.frameWidth || 64,
                frameHeight: idleSprite.frameHeight || 64
            }
        };

        return response;
    } catch (error) {
        console.error("Erreur getAvatarById : ", error.message);
        return null;
    }
};