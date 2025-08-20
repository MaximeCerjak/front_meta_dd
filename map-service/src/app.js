import express from 'express';
import dotenv from 'dotenv';
import mapRoutes from './routes/mapRoutes.js';
import gridRoutes from './routes/gridRoutes.js';
import teleporterRoutes from './routes/teleporterRoutes.js';
import swaggerRouter from './swagger.js';

dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use('/api/maps', mapRoutes);
app.use('/api/maps/grids', gridRoutes);
app.use('/api/maps/teleporters', teleporterRoutes);

// Swagger
app.use(swaggerRouter);

// Export de l'app
export default app;

// Démarrage du serveur seulement si ce n'est pas un test
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => console.log(`Map Service running on port ${PORT}`));
}