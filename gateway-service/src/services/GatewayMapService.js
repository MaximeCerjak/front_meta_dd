import axios from 'axios';

const MAP_SERVICE_URL = process.env.MAP_SERVICE_URL || 'http://map-service:5000/api';
const ASSET_SERVICE_URL = process.env.ASSET_SERVICE_URL || 'http://asset-service:4000/api';

export const addNewMap = async (data) => {
    const response = await axios.post(`${MAP_SERVICE_URL}/maps`, data);
    return response.data.map;
};

export const getMapById = async (id) => {
    try {
        const response = await axios.get(`${MAP_SERVICE_URL}/maps/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting map (Service):', error.response?.data || error.message);
        throw error;
    }
};

export const getMaps = async () => {
    try {
        const response = await axios.get(`${MAP_SERVICE_URL}/maps`);
        return response.data;
    } catch (error) {
        console.error('Error getting maps:', error.response?.data || error.message);
        throw error;
    }
};