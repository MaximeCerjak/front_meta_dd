import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import swaggerRouter from './config/swagger.js';

import assetRoutes from './routes/assets.js';
import userRoutes from './routes/gatewayUserRoute.js';
import gatewayMapRoutes from './routes/gatewayMapRoutes.js';
import gatewayChatbotRoute from './routes/gatewayChatbotRoute.js';
import gatewayMultiChatSimulatorRoutes from './routes/gatewayMultiChatSimulatorRoutes.js';

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use((req, res, next) => {
    console.log('Request headers:', req.headers);
    next();
});

// Routes
app.use('/api/assets', assetRoutes);
app.use('/api/maps', gatewayMapRoutes);
app.use('/api/users', userRoutes);
app.use('/api', gatewayChatbotRoute);
app.use('/api', gatewayMultiChatSimulatorRoutes);

// Swagger
app.use(swaggerRouter);

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Gateway Service is running on port ${PORT}`);
});
