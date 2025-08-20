import ExhibitionItem from './ExhibitionItem';

export default class InventoryManager {
    constructor(scene) {
        this.scene = scene;
        this.availableItems = this.initializeInventory();
        this.placedItems = new Map();
        this.isPlacementMode = false;
        this.selectedItemType = null;
        this.placementPreview = null;
        this.placementCursor = null;
        
        this.setupEventListeners();
        
        this.scene.time.delayedCall(100, () => {
            this.loadPlacedItems();
        });
    }

    initializeInventory() {
        // Inventaire de base avec quantités illimitées pour la démo
        return {
            frame: { 
                name: 'Cadre', 
                description: 'Parfait pour les images et documents',
                icon: '🖼️',
                count: -1, 
                supportedTypes: ['image', 'document']
            },
            pedestal: { 
                name: 'Piédestal', 
                description: 'Support universel pour tous types de médias',
                icon: '🏛️',
                count: -1,
                supportedTypes: ['image', 'document', 'audio', '3d']
            },
            stele: { 
                name: 'Stèle', 
                description: 'Grande surface pour expositions importantes',
                icon: '🗿',
                count: -1,
                supportedTypes: ['image', 'document', 'video']
            },
            easel: { 
                name: 'Chevalet', 
                description: 'Classique pour les œuvres picturales',
                icon: '🎨',
                count: -1,
                supportedTypes: ['image']
            },
            display: { 
                name: 'Écran', 
                description: 'Technologie moderne pour médias numériques',
                icon: '📺',
                count: -1,
                supportedTypes: ['video', 'audio', '3d']
            }
        };
    }

    setupEventListeners() {
        this.scene.events.on('inventory-item-selected', (itemType) => {
            console.log('InventoryManager - Événement reçu:', itemType);
            this.selectItemForPlacement(itemType);
        });

        this.scene.events.on('cancel-placement', () => {
            this.cancelPlacement();
        });

        this.scene.events.on('remove-exhibition-item', (itemId) => {
            this.removeItem(itemId);
        });

        this.scene.input.on('pointerdown', (pointer) => {
            if (this.isPlacementMode && pointer.leftButtonDown()) {
                console.log('Clic de placement détecté à:', pointer.worldX, pointer.worldY);
                this.placeItemAt(pointer.worldX, pointer.worldY);
            }
        });

        this.scene.input.on('pointermove', (pointer) => {
            if (this.isPlacementMode && this.placementPreview) {
                this.updatePlacementPreview(pointer.worldX, pointer.worldY);
            }
        });

        this.scene.input.on('pointerdown', (pointer) => {
            if (this.isPlacementMode && pointer.rightButtonDown()) {
                console.log('Annulation par clic droit');
                this.cancelPlacement();
            }
        });

        this.scene.input.keyboard.on('keydown-ESC', () => {
            if (this.isPlacementMode) {
                console.log('Annulation par ESC');
                this.cancelPlacement();
            }
        });
    }

    selectItemForPlacement(itemType) {
        console.log('selectItemForPlacement appelé avec:', itemType);
        
        if (!this.availableItems[itemType]) {
            console.warn('Type d\'objet inconnu:', itemType);
            return;
        }

        this.selectedItemType = itemType;
        this.isPlacementMode = true;
        console.log('Mode placement activé pour:', itemType);
        
        this.createPlacementPreview();

        if (this.scene.player) {
            console.log('Désactivation des contrôles du joueur');
            this.scene.player.disableControls();
        }

        this.scene.events.emit('show-notification', {
            message: `📦 Mode placement: ${this.availableItems[itemType].name}\nClic gauche: placer | Clic droit: annuler`,
            type: 'info',
            duration: 3000
        });
    }

    createPlacementPreview() {
        console.log('Création du preview pour:', this.selectedItemType);
        
        if (this.placementPreview) {
            this.placementPreview.destroy();
        }

        const config = this.getItemConfig(this.selectedItemType);
        
        this.placementPreview = this.scene.add.container(0, 0);
        
        const previewSprite = this.scene.add.rectangle(
            0, 0,
            config.width,
            config.height,
            config.color,
            0.5
        );
        previewSprite.setStrokeStyle(2, 0x00ff00);
        
        const previewLabel = this.scene.add.text(
            0, 0,
            config.name,
            {
                fontFamily: 'Arial',
                fontSize: '10px',
                color: '#00ff00',
                align: 'center'
            }
        );
        previewLabel.setOrigin(0.5);
        
        this.placementPreview.add([previewSprite, previewLabel]);
        this.placementPreview.setDepth(10);
        this.scene.input.setDefaultCursor('crosshair');
        console.log('Preview créé et curseur changé');
    }

    getItemConfig(type) {
        const configs = {
            frame: {
                width: 64,
                height: 80,
                color: 0x8b4513,
                name: 'Cadre'
            },
            pedestal: {
                width: 48,
                height: 64,
                color: 0x696969,
                name: 'Piédestal'
            },
            stele: {
                width: 56,
                height: 96,
                color: 0x2f4f4f,
                name: 'Stèle'
            },
            easel: {
                width: 72,
                height: 88,
                color: 0xd2691e,
                name: 'Chevalet'
            },
            display: {
                width: 80,
                height: 64,
                color: 0x000000,
                name: 'Écran'
            }
        };
        
        return configs[type] || configs.frame;
    }

    updatePlacementPreview(x, y) {
        if (this.placementPreview) {
            this.placementPreview.setPosition(x, y);
            
            const isValidPosition = this.isValidPlacementPosition(x, y);
            const color = isValidPosition ? 0x00ff00 : 0xff0000;
            
            this.placementPreview.list[0].setStrokeStyle(2, color);
            this.placementPreview.list[1].setColor(isValidPosition ? '#00ff00' : '#ff0000');
        }
    }

    isValidPlacementPosition(x, y) {
        console.log('Validation position:', x, y);
        
        const bounds = this.scene.cameras.main.getBounds();
        if (x < bounds.x || x > bounds.x + bounds.width || 
            y < bounds.y || y > bounds.y + bounds.height) {
            console.log('Position hors limites de la carte');
            return false;
        }

        // Vérifier la distance avec les autres objets placés
        const minDistance = 80;
        for (const [id, item] of this.placedItems) {
            const distance = Phaser.Math.Distance.Between(x, y, item.x, item.y);
            if (distance < minDistance) {
                console.log('Trop proche d\'un autre objet:', id);
                return false;
            }
        }

        // Vérifier la distance avec le joueur
        if (this.scene.player) {
            const playerDistance = Phaser.Math.Distance.Between(
                x, y, 
                this.scene.player.sprite.x, 
                this.scene.player.sprite.y
            );
            if (playerDistance < 60) {
                console.log('Trop proche du joueur');
                return false;
            }
        }

        console.log('Position valide');
        return true;
    }

    placeItemAt(x, y) {
        console.log('placeItemAt appelé avec:', x, y, 'mode placement:', this.isPlacementMode);
        
        if (!this.isValidPlacementPosition(x, y)) {
            console.log('Position invalide pour placement');
            this.scene.events.emit('show-notification', {
                message: '❌ Position invalide',
                type: 'error',
                duration: 1500
            });
            return;
        }

        const item = new ExhibitionItem(this.scene, x, y, this.selectedItemType);
        this.placedItems.set(item.itemId, item);

        this.addCollisionToItem(item);

        this.savePlacedItems();

        this.scene.events.emit('show-notification', {
            message: `✅ ${this.availableItems[this.selectedItemType].name} placé`,
            type: 'success',
            duration: 2000
        });

        console.log('Objet placé avec succès:', {
            id: item.itemId,
            type: this.selectedItemType,
            position: { x, y }
        });

        this.cancelPlacement();
    }

    addCollisionToItem(item) {
        if (this.scene.player && this.scene.player.sprite && !item.playerCollider) {
            const collider = this.scene.physics.add.collider(
                this.scene.player.sprite,
                item,
                null,
                null,
                this.scene
            );
            
            item.playerCollider = collider;
            console.log('Collision ajoutée à l\'objet:', item.itemId);
            return true;
        }
        return false;
    }

    addCollisionsToAllItems() {
        console.log('Ajout des collisions à tous les objets placés...');
        for (const [id, item] of this.placedItems) {
            this.addCollisionToItem(item);
        }
    }

    cancelPlacement() {
        this.isPlacementMode = false;
        this.selectedItemType = null;

        if (this.placementPreview) {
            this.placementPreview.destroy();
            this.placementPreview = null;
        }

        if (this.scene.player) {
            this.scene.player.enableControls();
        }

        this.scene.input.setDefaultCursor('default');

        this.scene.events.emit('show-notification', {
            message: '🔄 Mode placement annulé',
            type: 'info',
            duration: 1500
        });

        console.log('Mode placement annulé');
    }

    removeItem(itemId) {
        const item = this.placedItems.get(itemId);
        if (item) {
            if (item.playerCollider) {
                item.playerCollider.destroy();
                console.log('Collider supprimé pour objet:', itemId);
            }
            
            item.destroy();
            this.placedItems.delete(itemId);
            this.savePlacedItems();

            this.scene.events.emit('show-notification', {
                message: '🗑️ Objet retiré',
                type: 'warning',
                duration: 1500
            });

            console.log('Objet supprimé:', itemId);
        }
    }

    savePlacedItems() {
        try {
            const sceneKey = this.scene.scene.key;
            const data = {};
            
            for (const [id, item] of this.placedItems) {
                data[id] = {
                    type: item.itemType,
                    x: item.x,
                    y: item.y,
                    hasContent: !!item.mediaFile,
                    mediaType: item.mediaType,
                    fileName: item.mediaFile?.name
                };
            }

            const allData = JSON.parse(localStorage.getItem('exhibitionItems') || '{}');
            allData[sceneKey] = data;
            localStorage.setItem('exhibitionItems', JSON.stringify(allData));

        } catch (error) {
            console.error('Erreur sauvegarde objets placés:', error);
        }
    }

    loadPlacedItems() {
        try {
            const sceneKey = this.scene.scene.key;
            const allData = JSON.parse(localStorage.getItem('exhibitionItems') || '{}');
            const sceneData = allData[sceneKey] || {};

            for (const [id, itemData] of Object.entries(sceneData)) {
                const item = new ExhibitionItem(
                    this.scene, 
                    itemData.x, 
                    itemData.y, 
                    itemData.type,
                    { id }
                );
                
                if (itemData.hasContent) {
                    item.loadFromLocalStorage();
                }

                this.addCollisionToItem(item);

                this.placedItems.set(id, item);
            }

            if (Object.keys(sceneData).length > 0) {
                console.log(`${Object.keys(sceneData).length} objets d'exposition chargés avec collisions`);
            }

        } catch (error) {
            console.error('Erreur chargement objets placés:', error);
        }
    }

    getInventoryData() {
        return this.availableItems;
    }

    getPlacedItemsData() {
        const data = {};
        for (const [id, item] of this.placedItems) {
            data[id] = item.getItemInfo();
        }
        return data;
    }

    enableEditMode() {
        this.isEditMode = true;
        
        for (const [id, item] of this.placedItems) {
            item.itemSprite.setTint(0xffff00);
            item.itemSprite.removeAllListeners('pointerdown');
            
            item.itemSprite.on('pointerdown', (pointer) => {
                if (pointer.rightButtonDown()) {
                    this.removeItem(id);
                } else {
                    item.handleInteraction();
                }
            });
        }

        this.scene.events.emit('show-notification', {
            message: '✏️ Mode édition activé\nClic droit sur un objet pour le supprimer',
            type: 'info',
            duration: 3000
        });
    }

    disableEditMode() {
        this.isEditMode = false;
        
        for (const [id, item] of this.placedItems) {
            item.itemSprite.clearTint();
            item.setupInteractivity();
        }

        this.scene.events.emit('show-notification', {
            message: '✅ Mode édition désactivé',
            type: 'success',
            duration: 1500
        });
    }

    // Nettoyer tous les objets d'une scène
    clearAllItems() {
        for (const [id, item] of this.placedItems) {
            if (item.playerCollider) {
                item.playerCollider.destroy();
            }
            item.destroy();
        }
        this.placedItems.clear();
        this.savePlacedItems();

        this.scene.events.emit('show-notification', {
            message: '🧹 Tous les objets ont été retirés',
            type: 'warning',
            duration: 2000
        });
    }

    // Statistiques
    getStats() {
        const stats = {
            totalItems: this.placedItems.size,
            itemsWithContent: 0,
            itemsByType: {}
        };

        for (const [id, item] of this.placedItems) {
            if (item.mediaFile) stats.itemsWithContent++;
            
            if (!stats.itemsByType[item.itemType]) {
                stats.itemsByType[item.itemType] = 0;
            }
            stats.itemsByType[item.itemType]++;
        }

        return stats;
    }

    destroy() {
        if (this.placementPreview) {
            this.placementPreview.destroy();
        }
        
        this.scene.events.off('inventory-item-selected');
        this.scene.events.off('cancel-placement');
        this.scene.events.off('remove-exhibition-item');
        
        this.scene.input.off('pointerdown');
        this.scene.input.off('pointermove');
        
        for (const [id, item] of this.placedItems) {
            if (item.playerCollider) {
                item.playerCollider.destroy();
            }
            item.destroy();
        }
        this.placedItems.clear();
    }
}