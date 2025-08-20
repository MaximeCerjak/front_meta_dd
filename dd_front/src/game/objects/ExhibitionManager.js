import InventoryManager from './InventoryManager';
import { EventBus } from '../EventBus';

export default class ExhibitionManager {
    constructor(scene) {
        this.scene = scene;
        this.inventoryManager = new InventoryManager(scene);
        this.isInventoryOpen = false;
        this.isUploadDialogOpen = false;
        this.isMediaViewerOpen = false;
        this.currentUploadData = null;
        this.currentMediaData = null;
        this.audioContext = null;
        this.activeAudioSources = new Map();
        this.keyboardHandlers = null;
        
        this.setupEventListeners();
        
        this.scene.time.delayedCall(100, () => {
            this.setupKeyboardControls();
        });
    }

    setupEventListeners() {
        this.scene.events.on('show-tooltip', (data) => {
            this.showTooltip(data);
        });

        this.scene.events.on('hide-tooltip', () => {
            this.hideTooltip();
        });

        this.scene.events.on('open-upload-dialog', (data) => {
            this.openUploadDialog(data);
        });

        this.scene.events.on('view-media-content', (data) => {
            this.viewMediaContent(data);
        });

        this.scene.events.on('show-notification', (data) => {
            this.showNotification(data);
        });

        this.scene.events.on('inventory-item-selected', (itemType) => {
            console.log('ExhibitionManager - Relai événement vers InventoryManager:', itemType);
            // L'InventoryManager écoute déjà cet événement, pas besoin de faire quoi que ce soit ici
        });

        // Écouter les événements de l'interface React
        EventBus.on('exhibition-inventory-toggle', () => {
            this.toggleInventory();
        });

        // Écouter la sélection d'objets depuis React
        EventBus.on('inventory-item-selected', (itemType) => {
            console.log('ExhibitionManager - Événement EventBus reçu:', itemType);
            // Transmettre à l'InventoryManager via les événements de scène
            this.scene.events.emit('inventory-item-selected', itemType);
        });

        EventBus.on('exhibition-upload-complete', (data) => {
            this.handleUploadComplete(data);
        });

        EventBus.on('exhibition-upload-cancel', () => {
            this.handleUploadCancel();
        });

        EventBus.on('exhibition-media-close', () => {
            this.handleMediaViewerClose();
        });
    }

    setupKeyboardControls() {
        // Raccourci clavier pour ouvrir l'inventaire (Touche I)
        this.keyboardHandlers = {
            onKeyI: (event) => {
                if (!this.scene.isChatbotOpen && 
                    !this.scene.isMultiplayerChatOpen && 
                    !this.scene.isDialogueActive &&
                    !this.isAnyDialogOpen()) {
                    this.toggleInventory();
                }
            },
            
            onKeyE: (event) => {
                if (!this.scene.isChatbotOpen && 
                    !this.scene.isMultiplayerChatOpen && 
                    !this.scene.isDialogueActive && 
                    !this.isInventoryOpen) {
                    this.toggleEditMode();
                }
            },
            
            onKeyESC: (event) => {
                if (this.isMediaViewerOpen) {
                    this.handleMediaViewerClose();
                    event.stopPropagation();
                } else if (this.isUploadDialogOpen) {
                    this.handleUploadCancel();
                    event.stopPropagation();
                } else if (this.isInventoryOpen) {
                    this.toggleInventory();
                    event.stopPropagation();
                }
                // Si aucun dialog d'exposition n'est ouvert, laisser passer l'événement
            }
        };

        this.scene.input.keyboard.on('keydown-I', this.keyboardHandlers.onKeyI);
        this.scene.input.keyboard.on('keydown-E', this.keyboardHandlers.onKeyE);
        this.scene.input.keyboard.on('keydown-ESC', this.keyboardHandlers.onKeyESC);
    }

    toggleInventory() {
        this.isInventoryOpen = !this.isInventoryOpen;
        
        EventBus.emit('exhibition-inventory-state-changed', {
            isOpen: this.isInventoryOpen,
            inventoryManager: this.inventoryManager
        });

        if (this.isInventoryOpen) {
            if (this.scene.player) this.scene.player.disableControls();
        } else {
            if (this.scene.player) this.scene.player.enableControls();
        }

        console.log(`Inventaire ${this.isInventoryOpen ? 'ouvert' : 'fermé'}`);
    }

    toggleEditMode() {
        const stats = this.inventoryManager.getStats();
        if (stats.totalItems === 0) {
            this.showNotification({
                message: '📦 Aucun objet à éditer. Ajoutez d\'abord des objets depuis l\'inventaire.',
                type: 'info',
                duration: 3000
            });
            return;
        }

        if (this.inventoryManager.isEditMode) {
            this.inventoryManager.disableEditMode();
        } else {
            this.inventoryManager.enableEditMode();
        }
    }

    openUploadDialog(data) {
        this.currentUploadData = data;
        this.isUploadDialogOpen = true;

        if (this.scene.player) this.scene.player.disableControls();

        EventBus.emit('exhibition-upload-dialog-open', {
            itemId: data.itemId,
            itemName: data.itemName,
            supportedFormats: this.parseSupportedFormats(data.supportedFormats)
        });

        console.log('Dialog d\'upload ouvert pour:', data.itemName);
    }

    parseSupportedFormats(formatsString) {
        const formatToType = {
            'jpg': 'image', 'jpeg': 'image', 'png': 'image', 'gif': 'image', 'webp': 'image',
            'pdf': 'document', 'doc': 'document', 'docx': 'document', 'txt': 'document',
            'mp4': 'video', 'webm': 'video', 'ogg': 'video',
            'mp3': 'audio', 'wav': 'audio',
            'glb': '3d', 'gltf': '3d', 'obj': '3d'
        };

        const extensions = formatsString.split(',').map(f => f.trim().replace('.', ''));
        const types = [...new Set(extensions.map(ext => formatToType[ext]).filter(Boolean))];
        
        return types;
    }

    handleUploadComplete(data) {
        this.isUploadDialogOpen = false;
        
        if (this.scene.player) this.scene.player.enableControls();

        if (this.currentUploadData && this.currentUploadData.onFileSelected) {
            this.currentUploadData.onFileSelected(data.file, data.mediaType);
        }

        this.currentUploadData = null;
        console.log('Upload terminé:', data);
    }

    handleUploadCancel() {
        this.isUploadDialogOpen = false;
        this.currentUploadData = null;
        
        if (this.scene.player) this.scene.player.enableControls();

        console.log('Upload annulé');
    }

    viewMediaContent(data) {
        this.currentMediaData = data;
        this.isMediaViewerOpen = true;

        if (this.scene.player) this.scene.player.disableControls();

        if (data.mediaType === 'audio') {
            this.setupSpatialAudio(data);
        }

        EventBus.emit('exhibition-media-viewer-open', {
            file: data.file,
            mediaType: data.mediaType,
            itemName: data.itemName,
            position: data.position
        });

        console.log('Visionneuse de média ouverte:', data);
    }

    handleMediaViewerClose() {
        this.isMediaViewerOpen = false;
        
        if (this.scene.player) this.scene.player.enableControls();

        if (this.currentMediaData && this.currentMediaData.mediaType === 'audio') {
            this.stopSpatialAudio();
        }

        this.currentMediaData = null;
        console.log('Visionneuse de média fermée');
    }

    setupSpatialAudio(data) {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            const sourceId = `audio_${data.position.x}_${data.position.y}`;
            
            // En production, on créerait un système d'audio spatial 3D
            // Pour la démo, on simule juste la gestion de la distance
            this.activeAudioSources.set(sourceId, {
                position: data.position,
                file: data.file,
                isPlaying: false
            });

            console.log('Audio spatial configuré pour:', sourceId);
            
        } catch (error) {
            console.warn('Impossible de configurer l\'audio spatial:', error);
        }
    }

    stopSpatialAudio() {
        for (const [sourceId, source] of this.activeAudioSources) {
            if (source.isPlaying) {
                // En production, on arrêterait les WebAudio sources
                console.log('Arrêt audio spatial:', sourceId);
            }
        }
        this.activeAudioSources.clear();
    }

    updateSpatialAudio() {
        if (!this.scene.player || this.activeAudioSources.size === 0) return;

        const playerPos = {
            x: this.scene.player.sprite.x,
            y: this.scene.player.sprite.y
        };

        for (const [sourceId, source] of this.activeAudioSources) {
            const distance = Phaser.Math.Distance.Between(
                playerPos.x, playerPos.y,
                source.position.x, source.position.y
            );

            const maxDistance = 200; 
            const volume = Math.max(0, 1 - (distance / maxDistance));

            // En production, on ajusterait le volume et la spatialisation
            if (volume > 0 && !source.isPlaying) {
                source.isPlaying = true;
                console.log(`Audio spatial démarré: ${sourceId} (volume: ${volume.toFixed(2)})`);
            } else if (volume === 0 && source.isPlaying) {
                source.isPlaying = false;
                console.log(`Audio spatial arrêté: ${sourceId}`);
            }
        }
    }

    showTooltip(data) {
        if (this.tooltip) {
            this.tooltip.destroy();
        }

        const camera = this.scene.cameras.main;
        const screenPos = camera.getWorldPoint(data.x, data.y);

        this.tooltip = this.scene.add.container(screenPos.x, screenPos.y - 60);
        this.tooltip.setDepth(1000);
        this.tooltip.setScrollFactor(0);

        const bg = this.scene.add.rectangle(0, 0, 200, 60, 0x000000, 0.8);
        bg.setStrokeStyle(2, 0xd4af37);

        const text = this.scene.add.text(0, 0, data.text, {
            fontFamily: 'Arial',
            fontSize: '10px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 180 }
        });
        text.setOrigin(0.5);

        this.tooltip.add([bg, text]);

        const bounds = text.getBounds();
        bg.setSize(bounds.width + 20, bounds.height + 10);
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
    }

    showNotification(data) {
        if (this.notification) {
            this.notification.destroy();
        }

        const camera = this.scene.cameras.main;
        const x = camera.centerX;
        const y = camera.y + 100;

        this.notification = this.scene.add.container(x, y);
        this.notification.setDepth(1001);
        this.notification.setScrollFactor(0);

        const colors = {
            success: 0x00ff00,
            error: 0xff0000,
            warning: 0xffa500,
            info: 0x00bfff
        };
        const color = colors[data.type] || colors.info;

        const bg = this.scene.add.rectangle(0, 0, 300, 50, 0x000000, 0.9);
        bg.setStrokeStyle(2, color);

        const text = this.scene.add.text(0, 0, data.message, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 280 }
        });
        text.setOrigin(0.5);

        this.notification.add([bg, text]);

        const bounds = text.getBounds();
        bg.setSize(Math.max(300, bounds.width + 40), bounds.height + 20);

        this.notification.setAlpha(0);
        this.notification.setScale(0.8);
        
        this.scene.tweens.add({
            targets: this.notification,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });

        const duration = data.duration || 2000;
        this.scene.time.delayedCall(duration, () => {
            if (this.notification) {
                this.scene.tweens.add({
                    targets: this.notification,
                    alpha: 0,
                    scaleY: 0,
                    duration: 200,
                    ease: 'Power2.easeIn',
                    onComplete: () => {
                        if (this.notification) {
                            this.notification.destroy();
                            this.notification = null;
                        }
                    }
                });
            }
        });
    }

    update() {
        this.updateSpatialAudio();
    }

    getStats() {
        return this.inventoryManager.getStats();
    }

    getInventoryManager() {
        return this.inventoryManager;
    }

    isAnyDialogOpen() {
        return this.isInventoryOpen || this.isUploadDialogOpen || this.isMediaViewerOpen;
    }

    // Méthodes pour sauvegarder/charger l'état de l'exposition
    exportExhibitionData() {
        try {
            const sceneKey = this.scene.scene.key;
            const exhibitionData = JSON.parse(localStorage.getItem('exhibitionItems') || '{}');
            const sceneData = exhibitionData[sceneKey] || {};

            const exportData = {
                sceneKey: sceneKey,
                timestamp: new Date().toISOString(),
                items: sceneData,
                stats: this.getStats()
            };

            // Créer un fichier téléchargeable
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `exposition_${sceneKey}_${Date.now()}.json`;
            link.click();
            
            URL.revokeObjectURL(url);

            this.showNotification({
                message: '📥 Configuration d\'exposition exportée',
                type: 'success'
            });

        } catch (error) {
            console.error('Erreur export:', error);
            this.showNotification({
                message: '❌ Erreur lors de l\'export',
                type: 'error'
            });
        }
    }

    importExhibitionData(file) {
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = JSON.parse(e.target.result);
                
                if (data.sceneKey === this.scene.scene.key) {
                    // Importer dans la scène actuelle
                    const exhibitionData = JSON.parse(localStorage.getItem('exhibitionItems') || '{}');
                    exhibitionData[data.sceneKey] = data.items;
                    localStorage.setItem('exhibitionItems', JSON.stringify(exhibitionData));

                    // Recharger la scène pour appliquer les changements
                    this.scene.scene.restart();

                    this.showNotification({
                        message: '📤 Configuration d\'exposition importée',
                        type: 'success'
                    });
                } else {
                    this.showNotification({
                        message: '⚠️ Cette configuration est pour une autre scène',
                        type: 'warning'
                    });
                }
            };
            reader.readAsText(file);

        } catch (error) {
            console.error('Erreur import:', error);
            this.showNotification({
                message: '❌ Erreur lors de l\'import',
                type: 'error'
            });
        }
    }

    destroy() {
        this.hideTooltip();
        
        if (this.notification) {
            this.notification.destroy();
        }

        if (this.inventoryManager) {
            this.inventoryManager.destroy();
        }

        this.stopSpatialAudio();

        if (this.audioContext) {
            this.audioContext.close();
        }

        // Nettoyer les événements de scène
        this.scene.events.off('show-tooltip');
        this.scene.events.off('hide-tooltip');
        this.scene.events.off('open-upload-dialog');
        this.scene.events.off('view-media-content');
        this.scene.events.off('show-notification');

        // Nettoyer les événements EventBus
        EventBus.off('exhibition-inventory-toggle');
        EventBus.off('inventory-item-selected');
        EventBus.off('exhibition-upload-complete');
        EventBus.off('exhibition-upload-cancel');
        EventBus.off('exhibition-media-close');

        // Nettoyer les événements clavier spécifiques à l'exposition
        if (this.keyboardHandlers) {
            this.scene.input.keyboard.off('keydown-I', this.keyboardHandlers.onKeyI);
            this.scene.input.keyboard.off('keydown-E', this.keyboardHandlers.onKeyE);
            this.scene.input.keyboard.off('keydown-ESC', this.keyboardHandlers.onKeyESC);
        }
    }
}