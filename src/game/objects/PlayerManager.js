// src/objects/PlayerManager.js
import Player from './Player';

class PlayerManager {
    constructor() {
        this.player = null; // Stocke l'instance Player
        this.currentScene = null; // Scène dans laquelle le joueur est affiché
    }

    createPlayer(scene, x = 400, y = 300, textureKey = 'playerWalk') {
        if (this.player) {
            console.log('PlayerManager - Joueur déjà existant, repositionnement.');
            this.attachToScene(scene);
            this.setPosition(x, y);
            return this.player;
        }

        console.log('PlayerManager - Création du joueur.');
        this.player = new Player(scene, x, y, textureKey);
        this.currentScene = scene;

        // Ne pas définir de profondeur par défaut ici
        // Laisser BaseScene s'en charger
        return this.player;
    }

    attachToScene(scene) {
        if (!this.player || !this.player.sprite) return;

        console.log('PlayerManager - Attachement du joueur à la nouvelle scène.');
        
        // Sauvegarder la position et la profondeur actuelles
        const currentX = this.player.sprite.x;
        const currentY = this.player.sprite.y;
        const currentDepth = this.player.sprite.depth;
        
        // Détruire l'ancien sprite complètement
        if (this.player.sprite.scene) {
            this.player.sprite.destroy();
        }

        // Créer un nouveau joueur dans la nouvelle scène
        this.player = new Player(scene, currentX, currentY, 'playerWalk');
        this.currentScene = scene;
        
        // Restaurer la profondeur si elle était définie
        if (currentDepth !== undefined) {
            this.player.sprite.setDepth(currentDepth);
        }

        console.log('PlayerManager - Nouveau joueur créé dans la scène.');
    }

    setPosition(x, y) {
        if (this.player && this.player.sprite) {
            this.player.sprite.setPosition(x, y);
        }
    }

    setDepth(depth) {
        if (this.player && this.player.sprite) {
            this.player.sprite.setDepth(depth);
        }
    }

    getPlayer() {
        return this.player;
    }

    removeFromScene() {
        if (this.player && this.player.sprite && this.currentScene) {
            console.log('PlayerManager - Suppression du joueur de la scène actuelle.');
            // Ne pas supprimer manuellement, laisser Phaser gérer la destruction
        }
    }

    destroyPlayer() {
        if (this.player) {
            console.log('PlayerManager - Destruction du joueur.');
            if (this.player.sprite && !this.player.sprite.scene) {
                this.player.sprite.destroy();
            }
            this.player = null;
            this.currentScene = null;
        }
    }
}

export default new PlayerManager();