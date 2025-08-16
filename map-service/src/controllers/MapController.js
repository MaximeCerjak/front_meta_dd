import Map from '../models/Map.js';
import Teleporter from '../models/Teleporter.js';

// const validateFileExists = async (fileId) => {
//     const response = await fetch(`http://localhost:4000/api/assets/${fileId}`);
//     if (!response.ok) throw new Error('File does not exist.');
// };

export const createMap = async (req, res) => {
    const { name, description, layerFileIds, jsonFileId, metadata } = req.body;

    try {
        // Créer la carte
        const newMap = await Map.create({
            name,
            description,
            layerFileIds,
            jsonFileId,
            metadata,
        });

        res.status(201).send({ message: 'Map created successfully.', map: newMap });
    } catch (error) {
        res.status(500).send({ message: 'Error creating map.', error: error.message });
    }
};  

export const getMaps = async (req, res) => {
    try {
        const maps = await Map.findAll();
        res.status(200).json(maps);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving maps.', error: error.message });
    }
};

export const getMapById = async (req, res) => {
    const { id } = req.params;

    try {
        const map = await Map.findByPk(id);
        if (!map) {
            return res.status(404).json({ message: 'Map not found.' });
        }

        res.status(200).json(map);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving map.', error: error.message });
    }
};

export const updateMap = async (req, res) => {
    const { id } = req.params;
    const { name, description, file_id, json_file_id, metadata } = req.body;

    try {
        const map = await Map.findByPk(id);
        if (!map) {
            return res.status(404).json({ message: 'Map not found.' });
        }

        await map.update({ name, description, file_id, json_file_id, metadata });
        res.status(200).json({ message: 'Map updated successfully.', map });
    } catch (error) {
        res.status(500).json({ message: 'Error updating map.', error: error.message });
    }
};

export const deleteMap = async (req, res) => {
    const { id } = req.params;

    try {
        const map = await Map.findByPk(id);
        if (!map) {
            return res.status(404).json({ message: 'Map not found.' });
        }

        await map.destroy();
        res.status(200).json({ message: 'Map deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting map.', error: error.message });
    }
};
