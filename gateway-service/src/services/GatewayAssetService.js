import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import path from 'path';

const ASSET_SERVICE_URL = process.env.ASSET_SERVICE_URL || 'http://asset-service:4000/api';

export const uploadAvatar = async (avatarFile) => {
    try {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const response = await axios.post(`${ASSET_SERVICE_URL}/assets/game/images/avatars/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Avatar created:', response.data);
        return response.data.file.id;
    } catch (error) {
        console.error('Error creating avatar:', error.response?.data || error.message);
        throw error;
    }
};

export const getAvatars = async () => {
    try {
        const response = await axios.get(`${ASSET_SERVICE_URL}/assets/game/images/avatars`);
        return response.data;
    } catch (error) {
        console.error('Error getting avatars:', error.response?.data || error.message);
        throw error;
    }
};

export const getAssets = async (ids) => {
    try {
        const response = await axios.get(`${ASSET_SERVICE_URL}/assets`, {
            params: { ids: ids.join(',') },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting assets:', error.response?.data || error.message);
        throw error;
    }
};

export const getAssetById = async (assetId) => {
    try {
        console.log('Getting asset:', assetId);
        const response = await axios.get(`${ASSET_SERVICE_URL}/assets/${assetId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting avatar:', error.response?.data || error.message);
        throw error;
    }
};

export const uploadLayerFiles = async (layers) => {
    return Promise.all(
        layers.map(async (layer) => {
            const ext = path.extname(layer.originalname) || '';
            const filenameWithExt = `${layer.filename}${ext}`;

            const formData = new FormData();
            formData.append('file', fs.createReadStream(layer.path), {
                filename: filenameWithExt,
                contentType: layer.mimetype, // Assure le mimetype correct
            });
            formData.append('name', filenameWithExt);
            formData.append('description', 'Layer file');

            console.log('Sending file to asset-service:', {
                name: filenameWithExt,
                path: layer.path,
                mimetype: layer.mimetype,
            });

            try {
                const response = await axios.post(`${ASSET_SERVICE_URL}/assets/game/images/maps/upload`, formData, {
                    headers: formData.getHeaders(),
                });
                fs.unlinkSync(layer.path);
                return response.data.file.id;
            } catch (error) {
                console.error('Error uploading to asset-service:', error.response?.data || error.message);
                throw error;
            }
        })
    );
};

export const uploadJsonFile = async (jsonFile) => {
    const ext = path.extname(jsonFile.originalname) || '';
    const filenameWithExt = `${jsonFile.filename}${ext}`;

    const formData = new FormData();
    formData.append('file', fs.createReadStream(jsonFile.path), {
        filename: filenameWithExt,
        contentType: jsonFile.mimetype, // Assure le mimetype correct
    });
    formData.append('name', filenameWithExt);
    formData.append('description', 'JSON file');

    console.log('Sending file to asset-service:', {
        name: filenameWithExt, 
        path: jsonFile.path, 
        mimetype: jsonFile.mimetype
    });

    try {
        const response = await axios.post(`${ASSET_SERVICE_URL}/assets/game/json/maps/upload`, formData, {
            headers: formData.getHeaders(),
        });
        fs.unlinkSync(jsonFile.path);
        return response.data.file.id;
    } catch (error) {
        console.error('Error uploading to asset-service:', error.response?.data || error.message);
        throw error;
    }
};

export const getJsonFileById = async (jsonFileId) => {
    try {
        const response = await axios.get(`${ASSET_SERVICE_URL}/assets/${jsonFileId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting JSON file:', error.response?.data || error.message);
        throw error;
    }
};

export const getLayerFilesByIds = async (layerFileIds) => {
    try {
        const fileRequests = layerFileIds.map(async (id) => {
            const response = await axios.get(`${ASSET_SERVICE_URL}/assets/${id}`);
            return response.data;
        });
        const files = await Promise.all(fileRequests);
        return files;
    } catch (error) {
        console.error('Error getting layer files:', error.response?.data || error.message);
        throw error;
    }
};

export const createAsset = async (data) => {
    try {
        const response = await axios.post(`${ASSET_SERVICE_URL}/assets`, data);
        return response.data.asset;
    } catch (error) {
        console.error('Error creating asset:', error.response?.data || error.message);
        throw error;
    }
};