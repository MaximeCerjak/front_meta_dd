import Phaser from 'phaser';
import { Scene } from 'phaser';
import GameMap from '../objects/GameMap';
import PlayerManager from '../objects/PlayerManager';
import TeleporterManager from '../objects/TeleporterManager';
import InteractionManager from '../objects/InteractManager';
import LegendUI from '../ui/LegendUI';
import { EventBus } from '../EventBus';

/**
 * BaseScene centralise la logique commune : carte, joueur, téléporteurs,
 * collisions sur couche configurable, caméra, fade, debug et nettoyage.
 */
export default class BaseScene extends Scene {
    /**
     * @param {object} config
     * @param {string} config.key
     * @param {object} config.mapData
     * @param {boolean} [config.debug=false]
     * @param {boolean} [config.enableChatbot=true] 
     */
    constructor({ key, mapData, debug = false, interactionUIConfig = {}, enableChatbot = true }) {
        super({ key });
        this.mapData = mapData;
        this.debug = debug;
        this.enableChatbot = enableChatbot;
        this.player = null;
        this.gameMap = null;
        this.teleporterManager = null;
        this.interactionManager = null;
        this.cursors = null;
        this.colliders = [];
        this.interactionUIConfig = interactionUIConfig;
        this.isChatbotOpen = false;
        this.chatbotEventHandlers = {};
    }

    create(data) {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.gameMap = new GameMap(this, this.mapData);
        this.gameMap.create();

        const { x, y } = this.mapData.playerStart;
        this.player = PlayerManager.createPlayer(this, x, y);
        this.player.enableControls();

        const playerDepth = this.mapData.playerDepth !== undefined ? 
        this.mapData.playerDepth : 1;
        this.player.sprite.setDepth(playerDepth);

        this.teleporterManager = new TeleporterManager(this, this.gameMap.tilemap, this.player);

        this._handleEntry(data);

        this._setupColliders();

        this.gameMap.setupCameraFollow(this.cameras.main, this.player.sprite);

        this.cameras.main.fadeIn(300, 0, 0, 0);

        if (this.debug) this._setupDebug();

        let legendUI = null;
        if (this.interactionUIConfig) {
            legendUI = new LegendUI(this);
            if (this.interactionUIConfig.style) {
                legendUI.setStyle(this.interactionUIConfig.style);
            }
        }
        
        this.interactionManager = new InteractionManager(
            this, 
            this.gameMap.tilemap, 
            this.player,
            { legendUI }
        );

        if (this.enableChatbot) {
            this._setupChatbotControls();
        }

        this.events.on('shutdown', this._cleanup, this);
    }

    /**
     * Configure les contrôles du chatbot pour la scène
     */
    _setupChatbotControls() {
        this.chatbotEventHandlers.onChatbotOpened = () => {
            console.log('Chatbot ouvert - Désactivation des contrôles Phaser');
            this.isChatbotOpen = true;
            this._disablePhaserControls();
        };

        this.chatbotEventHandlers.onChatbotClosed = () => {
            console.log('Chatbot fermé - Réactivation des contrôles Phaser');
            this.isChatbotOpen = false;
            this._enablePhaserControls();
        };

        EventBus.on('chatbot-opened', this.chatbotEventHandlers.onChatbotOpened);
        EventBus.on('chatbot-closed', this.chatbotEventHandlers.onChatbotClosed);

        this.chatbotEventHandlers.onKeyC = (event) => {
            if (!this.isChatbotOpen) {
                console.log('Touche C pressée - Toggle chatbot');
                EventBus.emit('chatbot-toggle');
            }
        };

        this.input.keyboard.on('keydown-C', this.chatbotEventHandlers.onKeyC);
    }

    /**
     * Désactive les contrôles Phaser quand le chatbot est ouvert
     */
    _disablePhaserControls() {
        if (this.player) {
            this.player.disableControls();
        }

        this.input.keyboard.removeAllListeners();
        
        this.input.keyboard.on('keydown-ESC', () => {
            EventBus.emit('chatbot-close');
        });
    }

    /**
     * Réactive les contrôles Phaser quand le chatbot se ferme
     */
    _enablePhaserControls() {
        if (this.player) {
            this.player.enableControls();
        }

        this.input.keyboard.removeAllListeners();
        
        if (this.enableChatbot) {
            this.input.keyboard.on('keydown-C', this.chatbotEventHandlers.onKeyC);
        }

        if (this.debug) {
            this._setupDebugControls();
        }

        this._setupSceneSpecificControls();
    }

    /**
     * Méthode pour que les scènes enfants ajoutent leurs contrôles spécifiques
     * À override dans les scènes qui ont des raccourcis clavier spéciaux
     */
    _setupSceneSpecificControls() {
        // Exemple dans IntroScene : this.input.keyboard.on('keydown-P', () => this.spawnDevPortal());
    }

    update() {
        // Ne traiter les inputs que si le chatbot n'est pas ouvert
        if (!this.isChatbotOpen) {
            if (this.player) this.player.handleInput(this.cursors);
            if (this.interactionManager) this.interactionManager.update();
        }
    }

    /**
     * Place le joueur via teleport ou spawn par défaut
     */
    _handleEntry(data) {
        if (data?.entryFrom) {
        const zone = this.teleporterManager.getEntryZone(data.entryFrom);
        if (zone) {
            const exitPos = this.teleporterManager.calculateExitPosition(zone);
            
            this.player.sprite.setPosition(exitPos.x, exitPos.y);
            
            this.teleporterManager.animatePlayerEntry(zone, () => {
            console.log('Animation de téléportation terminée');
            });
            
            return;
        }
        }
        // Si pas de téléporteur, spawn au point de départ par défaut
        const { x, y } = this.mapData.playerStart;
        this.player.sprite.setPosition(x, y);
    }

    /**
    * Configure les collisions
    */
    _setupColliders() {
        let layersToCollide = [];

        if (Array.isArray(this.mapData.collideLayers)) {
            layersToCollide = this.mapData.collideLayers.map(selector => {
                return this.gameMap.getLayer(selector);
            }).filter(Boolean);
        } else if (this.mapData.collideAll === true) {
            layersToCollide = [...this.gameMap.layers];
        } else {
            layersToCollide = this._findCollidableLayers();
        }

        layersToCollide.forEach(layer => {
        if (layer) {
            const collider = this.gameMap.setupLayerCollisions(layer.layer.name, this.player.sprite);
            if (collider) {
            this.colliders.push(collider);
            }
        }
        });

        if (layersToCollide.length === 0) {
        console.warn('Aucun layer de collision configuré pour la scène', this.scene.key);
        } else {
        console.log(`Collisions configurées sur ${layersToCollide.length} layer(s):`, 
            layersToCollide.map(l => l.layer.name));
        }
    }

    /**
     * Trouve automatiquement les layers contenant des tuiles avec collision
     */
    _findCollidableLayers() {
        const collidableLayers = [];

        this.gameMap.layers.forEach(layer => {
        let hasCollidableTiles = false;
        
        layer.forEachTile(tile => {
            if (tile.index > 0 && tile.properties && tile.properties.collides === true) {
            hasCollidableTiles = true;
            return false; 
            }
        });

        const layerProps = layer.layer.properties || [];
        const hasLayerCollision = layerProps.some(prop => 
            prop.name === 'collides' && prop.value === true
        );

        if (hasCollidableTiles || hasLayerCollision) {
            collidableLayers.push(layer);
        }
        });

        return collidableLayers;
    }

    /**
     * Active affichage des infos debug (séparé pour pouvoir être réactivé)
     */
    _setupDebug() {
        this.physics.world.createDebugGraphic();
        this._setupDebugControls();
    }

    /**
     * Configure les contrôles de debug
     */
    _setupDebugControls() {
        this.input.keyboard.on('keydown-D', () => {
        console.log('=== DEBUG INFO ===');
        console.log('Scène:', this.scene.key);
        console.log('Player pos:', this.player.sprite.x, this.player.sprite.y);
        console.log('Camera bounds:', this.cameras.main.getBounds());
        console.log('Layers:', this.gameMap.layers.map(l => l.layer.name));
        console.log('Colliders actifs:', this.colliders.length);
        console.log('Chatbot activé:', this.enableChatbot);
        console.log('Chatbot ouvert:', this.isChatbotOpen);
        });

        this.input.keyboard.on('keydown-T', () => {
        console.log('=== TILE PROPERTIES DEBUG ===');
        this.gameMap.debugTileProperties();
        });

        // Affichage visuel des zones de collision
        this.input.keyboard.on('keydown-V', () => {
        this.gameMap.layers.forEach(layer => {
            layer.renderDebug(this.add.graphics(), {
            tileColor: null, 
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 128), 
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
            });
        });
        });
    }

    /**
    * Méthodes utilitaires pour les classes enfants
    */
  
    /**
     * Ajouter un collider personnalisé
     */
    addCustomCollider(object1, object2, collideCallback, processCallback, callbackContext) {
        const collider = this.physics.add.collider(
        object1, object2, collideCallback, processCallback, callbackContext
        );
        this.colliders.push(collider);
        return collider;
    }

    /**
     * Ajouter un overlap personnalisé
     */
    addCustomOverlap(object1, object2, overlapCallback, processCallback, callbackContext) {
        const overlap = this.physics.add.overlap(
        object1, object2, overlapCallback, processCallback, callbackContext
        );
        this.colliders.push(overlap); 
        return overlap;
    }

    /**
     * Cleanup managers et écouteurs
     */
    _cleanup() {
        console.log('Nettoyage de la scène:', this.scene.key);
        
        if (this.chatbotEventHandlers.onChatbotOpened) {
            EventBus.off('chatbot-opened', this.chatbotEventHandlers.onChatbotOpened);
        }
        if (this.chatbotEventHandlers.onChatbotClosed) {
            EventBus.off('chatbot-closed', this.chatbotEventHandlers.onChatbotClosed);
        }
        
        this.colliders.forEach(collider => {
        if (collider && collider.destroy) {
            collider.destroy();
        }
        });
        this.colliders = [];
        
        if (this.teleporterManager) {
        this.teleporterManager.destroy();
        this.teleporterManager = null;
        }

        if (this.interactionManager) {
            this.interactionManager.destroy();
            this.interactionManager = null;
        }
        
        this.input.keyboard.removeAllListeners();
        
        this.events.off('shutdown', this._cleanup, this);
    }
}