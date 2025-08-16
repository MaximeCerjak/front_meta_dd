import express from 'express';
import sequelize from '../config/database.js';
import userRoutes from './routes/userRoutes.js';

import swaggerRouter from './swagger.js';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

app.use(swaggerRouter);

sequelize.sync().then(() => {
  console.log('Database connected');
  app.listen(3000, '0.0.0.0', () => console.log('User service running on port 3000'));
});

export default app;