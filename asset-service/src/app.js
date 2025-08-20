import express from 'express';
import dotenv from 'dotenv';
import swaggerRouter from './swagger.js';
import assetRoutes from './routes/assetRoutes.js';
import File from './models/File.js';
import path from 'path';
import cors from 'cors';

dotenv.config();

const FRONT_URL = process.env.FRONT_URL || 'http://localhost:3002';

// Configuration de CORS
const corsOptions = {
    origin: [FRONT_URL],
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();

console.log('Asset Service has started!');

app.use(swaggerRouter);

app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(process.cwd(), 'src/uploads')));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Utiliser les routes définies
app.use('/api/assets', assetRoutes);

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/health', (req, res) => {
    console.log('Health check route hit');
    res.status(200).send({ status: 'OK' });
});

File.sync({ alter: true })
    .then(() => console.log('Table "files" is synchronized.'))
    .catch(err => console.error('Error synchronizing the table "files":', err));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Asset Service running on port ${PORT}`);
});
