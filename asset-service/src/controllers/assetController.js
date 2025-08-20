import multer from 'multer';
import path from 'path';
import fs from 'fs';
import File from '../models/File.js';

// Définition des scopes et types valides
const validScopes = ['game', 'user'];
const validTypes = ['audios', 'images', 'videos', 'documents', 'json'];
const validCategories = {
    game: {
        images: ['avatars', 'bestiary', 'buildings', 'characters', 'maps', 'objects', 'sandbox', 'admincenter', 'welcomeisle', 'exhibitionroom', 'museumreception'],
        audios: [],
        videos: [],
        json: ['maps', 'sandbox', 'admincenter', 'welcomeisle', 'exhibitionroom', 'museumreception']
    },
    user: {
        images: [],
        audios: [],
        videos: [],
        documents: []
    }
};

// Configuration dynamique de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { scope, type, category } = req.params;

        // Valider les scopes, types et catégories
        if (!validScopes.includes(scope)) {
            return cb(new Error(`Invalid scope. Allowed scopes: ${validScopes.join(', ')}`));
        }
        if (!validTypes.includes(type)) {
            return cb(new Error(`Invalid type. Allowed types: ${validTypes.join(', ')}`));
        }
        if (validCategories[scope][type] && !validCategories[scope][type].includes(category)) {
            return cb(
                new Error(
                    `Invalid category for scope ${scope} and type ${type}. Allowed categories: ${validCategories[scope][type].join(', ')}`
                )
            );
        }

        // Créer le chemin dynamiquement
        const directoryPath = path.join('src/uploads', scope, type, category);
        console.log('Destination path:', directoryPath);

        // Créer le dossier si nécessaire
        fs.mkdir(directoryPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating directory:', err);
                return cb(err);
            }
            cb(null, directoryPath);
        });
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const validateJSON = (filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    try {
        const jsonData = JSON.parse(fileContent);
        if (!jsonData.layers || !jsonData.tilesets || !jsonData.width || !jsonData.height) {
            throw new Error('Invalid JSON structure for Tiled map.');
        }
    } catch (err) {
        throw new Error('Invalid JSON file. Error: ' + err.message);
    }
};

const validateFileType = (file) => {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'application/json'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`);
    }
};

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single('file');

// Téléverser un fichier
export const uploadFile = async (req, res) => {
    console.log('Multer middleware hit');

    upload(req, res, async (err) => {
        console.log(req.file);
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).send({ message: 'File upload error', error: err.message });
        } else if (err) {
            console.error('Unknown error:', err);
            return res.status(400).send({ message: 'Unknown error during upload', error: err.message });
        }

        const { scope, type, category } = req.params;
        console.log('SERVICE_URL:', process.env.SERVICE_URL);
        const fileUrl = `${process.env.SERVICE_URL || 'http://localhost:4000'}/uploads/${scope}/${type}/${category}/${req.file.filename}`;
        const filePath = path.join('src/uploads', scope, type, category, req.file.filename);

        // Valider le type de fichier
        try {
            validateFileType(req.file);
        } catch (error) {
            return res.status(400).send({ message: 'Invalid file type.', error: error.message });
        }

        // Valider le fichier JSON si type = 'json'
        if (type === 'json') {
            console.log('Validating JSON file: ', type);
            try {
                validateJSON(filePath);
            } catch (error) {
                return res.status(400).send({ message: 'Invalid JSON file.', error: error.message });
            }
        }

        try {
            // Enregistrer les métadonnées dans la base de données
            const fileRecord = await File.create({
                filename: req.file.filename,
                type,
                category,
                scope,
                path: fileUrl,
                size: req.file.size,
                uploaded_by: req.user?.id || null, 
                name: req.body.name || req.file.originalname,
                description: req.body.description || null,
                dimensions: req.body.dimensions || null,
            });

            console.log('Uploaded file:', req.file);

            res.status(200).send({
                message: 'File uploaded successfully.',
                file: fileRecord,
            });
        } catch (error) {
            res.status(500).send({ message: 'Error saving file metadata.', error: error.message });
        }
    });
};

// Lister les fichiers
export const listFiles = async (req, res) => {
    const { scope, type, category } = req.params;

    try {
        const files = await File.findAll({
            where: { scope, type, category },
        });

        res.status(200).send(files);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving files.', error: error.message });
    }
};

export const listAllFiles = async (req, res) => {
    try {
        const files = await File.findAll();
        res.status(200).send(files);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving files.', error: error.message });
    }
};

export const listFileById = async (req, res) => {
    const { id } = req.params;

    try {
        const file = await File.findByPk(id);
        if (!file) {
            return res.status(404).send({ message: 'File not found.' });
        }
        
        res.status(200).send(file);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving file.', error: error.message });
    }
};

export const listFilesByScope = async (req, res) => {
    const { scope } = req.params;

    try {
        const files = await File.findAll({
            where: { scope },
        });

        res.status(200).send(files);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving files.', error: error.message });
    }
};

export const listFilesByType = async (req, res) => {
    const { scope } = req.params;
    const { type } = req.params;

    try {
        const files = await File.findAll({
            where: { scope, type },
        });

        res.status(200).send(files);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving files.', error: error.message });
    }
};

export const listFilesByCategory = async (req, res) => {
    const { scope } = req.params;
    const { type } = req.params;
    const { category } = req.params;

    try {
        const files = await File.findAll({
            where: { scope, type, category },
        });

        res.status(200).send(files);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving files.', error: error.message });
    }
};

// Supprimer un fichier
export const deleteFile = async (req, res) => {
    const { scope, type, category, filename } = req.params;

    try {
        const fileRecord = await File.findOne({
            where: { scope, type, category, filename },
        });

        if (!fileRecord) {
            return res.status(404).send({ message: 'File not found.' });
        }

        const filePath = path.join('src/uploads', scope, type, category, filename);
        fs.unlink(filePath, async (err) => {
            if (err) {
                return res.status(404).send({ message: 'File not found on disk.', error: err.message });
            }

            await fileRecord.destroy();
            res.status(200).send({ message: 'File deleted successfully.' });
        });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting file.', error: error.message });
    }
};

