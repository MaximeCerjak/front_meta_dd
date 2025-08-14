import axios from 'axios';

class ApiManager {
    constructor(baseURL) {
        this.apiClient = axios.create({
            baseURL,
            timeout: 35000, 
        });
    }

    // Récupérer tous les fichiers dans le dossier avatar
    async getAvatars() {
        try {
            const response = await this.apiClient.get('/assets/game/images/avatars');
            console.log('Avatars:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des avatars:', error);
            throw error;
        }
    }

    // Récupérer tous les fichiers
    async getAllAssets() {
        try {
            const response = await this.apiClient.get('/assets');
            console.log('Tous les fichiers:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des fichiers:', error);
            throw error;
        }
    }

    // Récupérer le profil utilisateur anonyme
    async getAnonymUser() {
        try {
            const response = await this.apiClient.get('/users/anonym');
            console.log('Utilisateur anonyme:', response);
            return response;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur anonyme:', error);
            throw error;
        }
    }


    // Récupérer un fichier par son ID
    async getAssetById(assetId) {
        try {
            const response = await this.apiClient.get(`/assets/${assetId}`);
            console.log('Asset récupéré:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'asset:', error);
            throw error;
        }
    }

    // Récupérer toutes les cartes
    async getAllMaps() {
        try {
            const response = await this.apiClient.get('/maps');
            console.log('Toutes les cartes:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des cartes:', error);
            throw error;
        }
    }

    // Récupérer une carte par son ID
    async getMapById(mapId) {
        try {
            const response = await this.apiClient.get(`/maps/${mapId}`);
            console.log('[ApiManager] Carte récupérée depuis l\'API :', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de la carte :', error);
            throw error;
        }
    }    

    // Inscription d'un nouvel utilisateur
    async registerUser(username, email, password) {
        try {
            const response = await this.apiClient.post('/users/register', { username, email, password });
            console.log('Utilisateur inscrit:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            throw error;
        }
    }

    // Création d'un avatar
    async createAvatar(avatarFile) {
        try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);

            const response = await this.apiClient.post('/users/avatars', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Avatar créé:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de l\'avatar:', error);
            throw error;
        }
    }

    async getAnonymAvatar() {
        try {
            const response = await this.apiClient.get('/users/avatars/1');
            console.log('Avatar anonyme:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'avatar anonyme:', error);
            throw error;
        }
    }

    // Récupérer l'avatar d'un utilisateur
    async getUserAvatar(userId) {
        try {
            const response = await this.apiClient.get(`/users/${userId}/avatar`);
            console.log('Avatar de l\'utilisateur:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'avatar:', error);
            throw error;
        }
    }

    // Connexion d'un utilisateur
    async loginUser(username, password) {
        try {
            const response = await this.apiClient.post('/users/login', { username, password });
            console.log('Utilisateur connecté:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            throw error;
        }
    }

    // Dialoguer avec le chatbot
    async chatWithBot(payload) {
        try {
            const response = await this.apiClient.post('/chatbot', payload);
            console.log('Réponse du chatbot:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la communication avec le chatbot:', error);
            throw error;
        }
    }
}

export default new ApiManager('http://localhost:8080/api');
