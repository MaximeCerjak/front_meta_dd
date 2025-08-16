import { jest } from '@jest/globals';
import { uploadFile, listAllFiles, listFileById, deleteFile } from '../../src/controllers/assetController.js';

// Mock du modèle File
const mockFile = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    sync: jest.fn().mockResolvedValue()
};

jest.mock('../../src/models/File.js', () => ({
    default: mockFile
}));

describe('AssetController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {
                scope: 'game',
                type: 'images',
                category: 'avatars'
            },
            file: {
                filename: 'test-1234567890.png',
                originalname: 'test.png',
                mimetype: 'image/png',
                size: 1024
            },
            body: {
                name: 'Test Asset',
                description: 'Test description'
            },
            user: { id: 'test-user-123' }
        };
        
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn()
        };
        
        next = jest.fn();
        
        // Reset mocks
        jest.clearAllMocks();
    });

    describe('uploadFile', () => {
        test('should upload file successfully', async () => {
            const mockFileRecord = {
                id: 1,
                filename: 'test-1234567890.png',
                name: 'Test Asset',
                type: 'images',
                category: 'avatars',
                scope: 'game'
            };

            mockFile.create.mockResolvedValue(mockFileRecord);

            await uploadFile(req, res);

            expect(mockFile.create).toHaveBeenCalledWith({
                filename: 'test-1234567890.png',
                type: 'images',
                category: 'avatars',
                scope: 'game',
                path: expect.stringContaining('uploads/game/images/avatars/test-1234567890.png'),
                size: 1024,
                uploaded_by: 'test-user-123',
                name: 'Test Asset',
                description: 'Test description',
                dimensions: null
            });

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                message: 'File uploaded successfully.',
                file: mockFileRecord
            });
        });

        test('should handle invalid scope', async () => {
            req.params.scope = 'invalid';

            await uploadFile(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                message: 'File upload error',
                error: expect.stringContaining('Invalid scope')
            });
        });

        test('should handle database error', async () => {
            mockFile.create.mockRejectedValue(new Error('Database error'));

            await uploadFile(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: 'Error saving file metadata.',
                error: 'Database error'
            });
        });
    });

    describe('listAllFiles', () => {
        test('should return all files', async () => {
            const mockFiles = [
                { id: 1, name: 'File 1', scope: 'game' },
                { id: 2, name: 'File 2', scope: 'user' }
            ];

            mockFile.findAll.mockResolvedValue(mockFiles);

            await listAllFiles(req, res);

            expect(mockFile.findAll).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockFiles);
        });

        test('should handle database error', async () => {
            mockFile.findAll.mockRejectedValue(new Error('Database error'));

            await listAllFiles(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: 'Error retrieving files.',
                error: 'Database error'
            });
        });
    });

    describe('listFileById', () => {
        test('should return file by id', async () => {
            const mockFile_instance = { id: 1, name: 'Test File' };
            req.params.id = '1';

            mockFile.findByPk.mockResolvedValue(mockFile_instance);

            await listFileById(req, res);

            expect(mockFile.findByPk).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockFile_instance);
        });

        test('should return 404 if file not found', async () => {
            req.params.id = '999';
            mockFile.findByPk.mockResolvedValue(null);

            await listFileById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                message: 'File not found.'
            });
        });
    });

    describe('deleteFile', () => {
        test('should delete file successfully', async () => {
            const mockFileRecord = {
                id: 1,
                filename: 'test.png',
                destroy: jest.fn().mockResolvedValue()
            };

            req.params.filename = 'test.png';
            mockFile.findOne.mockResolvedValue(mockFileRecord);

            await deleteFile(req, res);

            expect(mockFile.findOne).toHaveBeenCalledWith({
                where: {
                    scope: 'game',
                    type: 'images',
                    category: 'avatars',
                    filename: 'test.png'
                }
            });
            expect(mockFileRecord.destroy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                message: 'File deleted successfully.'
            });
        });

        test('should return 404 if file not found', async () => {
            req.params.filename = 'nonexistent.png';
            mockFile.findOne.mockResolvedValue(null);

            await deleteFile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                message: 'File not found.'
            });
        });
    });
});