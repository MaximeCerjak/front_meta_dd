import { addNewMap, getMaps, getMapById } from '../services/GatewayMapService.js';
import { uploadLayerFiles, uploadJsonFile, getAssetById, getLayerFilesByIds } from '../services/GatewayAssetService.js';

export const createMap = async (req, res) => {
    console.log('Files received by Multer:', req.files);
    console.log('Body received by Multer:', req.body);

    try {
        // Étape 1 : Téléverser les fichiers des couches
        try {
            var layerFileIds = await uploadLayerFiles(req.files.layers);
        } catch (error) {
            console.error('Error uploading layer files:', error.message);
            return res.status(500).send({
                message: 'Error uploading layer files.',
                error: error.message,
            });
        }

        // Étape 2 : Téléverser le fichier JSON
        try {
            var jsonFileId = await uploadJsonFile(req.files.json[0]);
        } catch (error) {
            console.error('Error uploading JSON file:', error.message);
            return res.status(500).send({
                message: 'Error uploading JSON file.',
                error: error.message,
            });
        }

        // Étape 3 : Créer la carte via le map-service
        try {
            const map = await addNewMap({
                name: req.body.name,
                description: req.body.description,
                layerFileIds,
                jsonFileId,
                metadata: JSON.parse(req.body.metadata),
            });

            // Réponse finale
            res.status(201).send({
                message: 'Map created successfully via gateway.',
                map,
            });
        } catch (error) {
            console.error('Error creating map via gateway:', error.message);
            res.status(500).send({
                message: 'Error creating map via gateway.',
                error: error.message,
            });
        }
    } catch (error) {
        console.error('Error creating map via gateway:', error.message);
        res.status(500).send({
            message: 'Error creating map via gateway.',
            error: error.message,
        });
    }
};

export const getMap = async (req, res) => {
    const { id } = req.params;

    try {
        const map = await getMapById(id);
    
        if (!map) {
            return res.status(404).send({ message: 'Map not found.' });
        }
    
        const jsonFile = await getAssetById(map.jsonFileId);
        const layerFiles = await getLayerFilesByIds(map.layerFileIds);
    
        res.status(200).send({
            message: 'Map retrieved successfully.',
            map: {
                id: map.id,
                name: map.name,
                description: map.description,
                metadata: map.metadata,
                createdAt: map.created_at,
                updatedAt: map.updated_at,
                jsonFile: {
                    id: jsonFile.id,
                    name: jsonFile.name,
                    path: jsonFile.path,
                    size: jsonFile.size,
                },
                layerFiles: layerFiles.map((layer) => ({
                    id: layer.id,
                    name: layer.name,
                    path: layer.path,
                    size: layer.size,
                })),
            },
        });
        
    } catch (error) {
        console.error('Error retrieving map data:', error.message);
        res.status(500).send({
            message: 'Error retrieving map data.',
            error: error.message,
        });
    }    
};

export const getAllMaps = async (req, res) => {
    try {
        const maps = await getMaps();
        res.status(200).send({
            message: 'Maps retrieved successfully.',
            maps,
        });
    } catch (error) {
        console.error('Error retrieving maps:', error.message);
        res.status(500).send({
            message: 'Error retrieving maps.',
            error: error.message,
        });
    }
}
