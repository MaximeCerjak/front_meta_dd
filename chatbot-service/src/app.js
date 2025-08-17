import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import multiChatSimulatorRoutes from "./routes/multiChatSimulatorRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 6000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware simple
app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    }
    next();
});

// Routes
app.use("/", healthRoutes);
app.use("/api", chatbotRoutes);
app.use("/api/multiplayer", multiChatSimulatorRoutes);

// Route de base
app.get("/", (req, res) => {
    res.json({
        message: "🎨 Chatbot Service - Metavers Artistique d'Avignon",
        version: "1.0.0",
        endpoints: {
            health: "/health",
            chatbot: "/api/chatbot",
            multiplayer: "/api/multiplayer/*"
        },
        documentation: "/api-docs"
    });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
    console.error('Erreur non gérée:', err);
    
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Une erreur interne est survenue' 
            : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route non trouvée',
        path: req.originalUrl,
        suggestion: 'Consultez la documentation à /'
    });
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
    console.log('🛑 Signal SIGTERM reçu, arrêt gracieux...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Signal SIGINT reçu, arrêt gracieux...');
    process.exit(0);
});

// Démarrage du serveur
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
        console.log(`📖 Documentation disponible sur http://localhost:${port}/`);
        console.log(`❤️ Health check: http://localhost:${port}/health`);
        console.log(`🎯 Environnement: ${process.env.NODE_ENV || 'development'}`);
    });
}

export default app;
