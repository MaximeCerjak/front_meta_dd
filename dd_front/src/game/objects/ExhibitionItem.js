import Phaser from 'phaser';

export default class ExhibitionItem extends Phaser.GameObjects.Container {
    constructor(scene, x, y, itemType, config = {}) {
        super(scene, x, y);
        
        this.scene = scene;
        this.itemType = itemType; 
        this.itemId = config.id || `item_${Date.now()}`;
        this.mediaFile = null;
        this.mediaType = null;
        this.isInteractive = true;
        
        this.itemConfig = this.getItemConfig(itemType);
        
        this.createItemSprite();
        
        this.createContentIndicator();
        
        scene.add.existing(this);
        
        scene.physics.add.existing(this);
        
        this.body.setSize(this.itemConfig.width, this.itemConfig.height);
        this.body.setOffset(-this.itemConfig.width / 2, -this.itemConfig.height / 2);
        this.body.setImmovable(true);
        
        this.setupInteractivity();
        
        this.setDepth(1);
        
        console.log('ExhibitionItem créé:', {
            id: this.itemId,
            type: itemType,
            position: { x, y },
            bodySize: { width: this.itemConfig.width, height: this.itemConfig.height }
        });
    }

    getItemConfig(type) {
        const configs = {
            frame: {
                texture: 'exhibition_frame',
                width: 64,
                height: 80,
                supportedTypes: ['image', 'document'],
                color: 0x8b4513,
                name: 'Cadre'
            },
            pedestal: {
                texture: 'exhibition_pedestal',
                width: 48,
                height: 64,
                supportedTypes: ['image', 'document', 'audio', '3d'],
                color: 0x696969,
                name: 'Piédestal'
            },
            stele: {
                texture: 'exhibition_stele',
                width: 56,
                height: 96,
                supportedTypes: ['image', 'document', 'video'],
                color: 0x2f4f4f,
                name: 'Stèle'
            },
            easel: {
                texture: 'exhibition_easel',
                width: 72,
                height: 88,
                supportedTypes: ['image'],
                color: 0xd2691e,
                name: 'Chevalet'
            },
            display: {
                texture: 'exhibition_display',
                width: 80,
                height: 64,
                supportedTypes: ['video', 'audio', '3d'],
                color: 0x000000,
                name: 'Écran'
            }
        };
        
        return configs[type] || configs.frame;
    }

    createItemSprite() {
        // En production on utiliserait un sprite
        this.itemSprite = this.scene.add.rectangle(
            0, 0,
            this.itemConfig.width,
            this.itemConfig.height,
            this.itemConfig.color,
            0.8
        );
        
        this.itemSprite.setStrokeStyle(2, 0xffffff);
        
        this.itemLabel = this.scene.add.text(
            0, 0,
            this.itemConfig.name,
            {
                fontFamily: 'Arial',
                fontSize: '10px',
                color: '#ffffff',
                align: 'center'
            }
        );
        this.itemLabel.setOrigin(0.5);
        
        this.add([this.itemSprite, this.itemLabel]);
    }

    createContentIndicator() {
        this.contentIndicator = this.scene.add.circle(
            this.itemConfig.width / 2 - 8,
            -this.itemConfig.height / 2 + 8,
            6,
            0xff0000,
            0
        );
        this.contentIndicator.setStrokeStyle(2, 0xff0000);
        this.contentIndicator.setVisible(false);
        
        this.add(this.contentIndicator);
    }

    setupInteractivity() {
        this.itemSprite.setInteractive();
        
        this.itemSprite.on('pointerover', () => {
            this.itemSprite.setAlpha(1);
            this.showInfoTooltip();
        });
        
        this.itemSprite.on('pointerout', () => {
            this.itemSprite.setAlpha(0.8);
            this.hideInfoTooltip();
        });
        
        this.itemSprite.on('pointerdown', () => {
            this.handleInteraction();
        });
    }

    showInfoTooltip() {
        const hasContent = this.mediaFile ? '📄 Contenu disponible' : '📁 Vide';
        const text = `${this.itemConfig.name}\n${hasContent}\nClic pour ${this.mediaFile ? 'consulter' : 'ajouter du contenu'}`;
        
        this.scene.events.emit('show-tooltip', {
            x: this.x,
            y: this.y - this.itemConfig.height,
            text: text
        });
    }

    hideInfoTooltip() {
        this.scene.events.emit('hide-tooltip');
    }

    handleInteraction() {
        if (this.mediaFile) {
            this.viewContent();
        } else {
            this.openUploadDialog();
        }
    }

    openUploadDialog() {
        const supportedFormats = this.getSupportedFormats();
        
        this.scene.events.emit('open-upload-dialog', {
            itemId: this.itemId,
            itemName: this.itemConfig.name,
            supportedFormats: supportedFormats,
            onFileSelected: (file, mediaType) => {
                this.setContent(file, mediaType);
            }
        });
    }

    getSupportedFormats() {
        const formatMap = {
            image: '.jpg,.jpeg,.png,.gif,.webp',
            document: '.pdf,.doc,.docx,.txt',
            video: '.mp4,.webm,.ogg',
            audio: '.mp3,.wav,.ogg',
            '3d': '.glb,.gltf,.obj'
        };
        
        return this.itemConfig.supportedTypes
            .map(type => formatMap[type])
            .filter(Boolean)
            .join(',');
    }

    setContent(file, mediaType) {
        this.mediaFile = file;
        this.mediaType = mediaType;
        
        this.contentIndicator.setVisible(true);
        this.contentIndicator.setFillStyle(this.getMediaTypeColor(mediaType));
        
        this.saveToLocalStorage();
        
        console.log(`Contenu ajouté à ${this.itemConfig.name}:`, {
            type: mediaType,
            fileName: file.name,
            size: file.size
        });
        
        this.scene.events.emit('show-notification', {
            message: `📄 Contenu ajouté au ${this.itemConfig.name}`,
            type: 'success'
        });
    }

    getMediaTypeColor(type) {
        const colors = {
            image: 0x00ff00,    
            document: 0x0000ff,
            video: 0xff00ff,  
            audio: 0xffff00,
            '3d': 0x00ffff
        };
        return colors[type] || 0xff0000;
    }

    viewContent() {
        if (!this.mediaFile) return;
        
        this.scene.events.emit('view-media-content', {
            file: this.mediaFile,
            mediaType: this.mediaType,
            itemName: this.itemConfig.name,
            position: { x: this.x, y: this.y }
        });
    }

    saveToLocalStorage() {
        try {
            const exhibitionData = JSON.parse(localStorage.getItem('exhibitionItems') || '{}');
            const sceneKey = this.scene.scene.key;
            
            if (!exhibitionData[sceneKey]) {
                exhibitionData[sceneKey] = {};
            }
            
            exhibitionData[sceneKey][this.itemId] = {
                type: this.itemType,
                x: this.x,
                y: this.y,
                mediaType: this.mediaType,
                fileName: this.mediaFile?.name,
                // Note: on ne peut pas sauvegarder le File object directement
                // En production, on uploaderait vers le serveur
                hasContent: !!this.mediaFile
            };
            
            localStorage.setItem('exhibitionItems', JSON.stringify(exhibitionData));
        } catch (error) {
            console.error('Erreur sauvegarde localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const exhibitionData = JSON.parse(localStorage.getItem('exhibitionItems') || '{}');
            const sceneKey = this.scene.scene.key;
            const itemData = exhibitionData[sceneKey]?.[this.itemId];
            
            if (itemData && itemData.hasContent) {
                this.mediaType = itemData.mediaType;
                this.contentIndicator.setVisible(true);
                this.contentIndicator.setFillStyle(this.getMediaTypeColor(this.mediaType));
                
                this.mediaFile = {
                    name: itemData.fileName,
                    type: this.getFileTypeFromMediaType(itemData.mediaType),
                    size: 0,
                    isDemo: true
                };
            }
        } catch (error) {
            console.error('Erreur lecture localStorage:', error);
        }
    }

    getFileTypeFromMediaType(mediaType) {
        const typeMap = {
            image: 'image/jpeg',
            document: 'application/pdf',
            video: 'video/mp4',
            audio: 'audio/mp3',
            '3d': 'model/gltf+json'
        };
        return typeMap[mediaType] || 'application/octet-stream';
    }

    removeContent() {
        this.mediaFile = null;
        this.mediaType = null;
        this.contentIndicator.setVisible(false);
        this.saveToLocalStorage();
        
        this.scene.events.emit('show-notification', {
            message: `🗑️ Contenu retiré du ${this.itemConfig.name}`,
            type: 'warning'
        });
    }

    moveTo(x, y) {
        this.setPosition(x, y);
        this.saveToLocalStorage();
    }

    destroy() {
        this.hideInfoTooltip();
        
        if (this.playerCollider) {
            this.playerCollider.destroy();
            console.log('Collider nettoyé pour objet:', this.itemId);
        }
        
        super.destroy();
    }

    getItemInfo() {
        return {
            id: this.itemId,
            type: this.itemType,
            name: this.itemConfig.name,
            position: { x: this.x, y: this.y },
            hasContent: !!this.mediaFile,
            mediaType: this.mediaType,
            fileName: this.mediaFile?.name
        };
    }
}