import request from 'supertest';
import app from '../../src/app.js';

describe('Health Routes', () => {
    describe('GET /health', () => {
        test('devrait retourner le status de santé du service', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body).toEqual(
                expect.objectContaining({
                    status: 'OK',
                    service: 'chatbot-service',
                    version: expect.any(String),
                    timestamp: expect.any(String),
                    uptime: expect.any(Number),
                    environment: expect.any(String),
                    memory: expect.objectContaining({
                        used: expect.any(Number),
                        total: expect.any(Number)
                    })
                })
            );
        });
    });

    describe('GET /ready', () => {
        test('devrait retourner ready si le service est opérationnel', async () => {
            const response = await request(app)
                .get('/ready')
                .expect(200);

            expect(response.body).toEqual(
                expect.objectContaining({
                    status: 'Ready',
                    service: 'chatbot-service',
                    timestamp: expect.any(String)
                })
            );
        });
    });

    describe('GET /', () => {
        test('devrait retourner les informations de base du service', async () => {
            const response = await request(app)
                .get('/')
                .expect(200);

            expect(response.body).toEqual(
                expect.objectContaining({
                    message: expect.stringContaining('Chatbot Service'),
                    version: expect.any(String),
                    endpoints: expect.any(Object)
                })
            );
        });
    });

    describe('GET /nonexistent', () => {
        test('devrait retourner 404 pour les routes inexistantes', async () => {
            const response = await request(app)
                .get('/nonexistent')
                .expect(404);

            expect(response.body).toEqual(
                expect.objectContaining({
                    error: 'Route non trouvée',
                    path: '/nonexistent'
                })
            );
        });
    });
});