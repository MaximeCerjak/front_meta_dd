import axios from 'axios';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3000/api';

export const register = async (userData) => {
    const response = await axios.post(`${USER_SERVICE_URL}/users/register`, userData);
    return response.data;
};

export const login = async (userData) => {
    const response = await axios.post(`${USER_SERVICE_URL}/users/login`, userData);
    return response.data;
};

export const getAvatarById = async (id) => {
    const response = await axios.get(`${USER_SERVICE_URL}/users/avatars/${id}`);
    return response.data;
};

export const postAvatar = async (avatarData) => {
    console.log('Data received in Gateway:', avatarData);
    try {
        const response = await axios.post(`${USER_SERVICE_URL}/users/avatars`, avatarData);
        console.log('Data sent to User Service:', response.data);
        return response.data;
    } catch (error) {     
        console.error('Erreur lors de la création de l\'avatar :', error);
        throw error;
    }
};

export const testToken = async () => {
    try {
        const response = await axios.get(`${USER_SERVICE_URL}/users/test`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'appel pour la validation du token : ', error);
        throw error;
    }
}