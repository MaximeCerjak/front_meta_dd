import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check du service
 *     description: Vérification de l'état du service chatbot
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service opérationnel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 service:
 *                   type: string
 *                   example: "chatbot-service"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: "Uptime en secondes"
 *                 environment:
 *                   type: string
 *                   example: "development"
 */
router.get('/health', (req, res) => {
    const healthData = {
        status: 'OK',
        service: 'chatbot-service',
        version: process.env.npm_package_version || '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV || 'development',
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        }
    };

    res.status(200).json(healthData);
});

/**
 * @swagger
 * /ready:
 *   get:
 *     summary: Readiness check
 *     description: Vérification que le service est prêt à recevoir du trafic
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service prêt
 *       503:
 *         description: Service non prêt
 */
router.get('/ready', (req, res) => {
    // Ici vous pourriez vérifier la connexion à la DB, APIs externes, etc.
    const isReady = checkServiceReadiness();
    
    if (isReady) {
        res.status(200).json({
            status: 'Ready',
            service: 'chatbot-service',
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(503).json({
            status: 'Not Ready',
            service: 'chatbot-service',
            timestamp: new Date().toISOString(),
            reason: 'Service dependencies not available'
        });
    }
});

// Fonction pour vérifier si le service est prêt
function checkServiceReadiness() {
    // Vérifications basiques
    try {
        // Vérifier que la clé OpenAI est présente (en développement)
        if (process.env.NODE_ENV !== 'test' && !process.env.OPENAI_API_KEY) {
            return false;
        }
        
        // Autres vérifications possibles :
        // - Connexion à la base de données
        // - APIs externes disponibles
        // - Configuration correcte
        
        return true;
    } catch (error) {
        console.error('Readiness check failed:', error);
        return false;
    }
}

export default router;