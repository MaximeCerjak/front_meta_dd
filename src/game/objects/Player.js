import Character from './Character';

export default class Player extends Character {
    constructor(scene, x, y, textureKey = 'playerWalk') {
        super(scene, x, y, textureKey);

        this.currentDirection = 'down'; // Direction par défaut
        this.controlsEnabled = true; // Nouveau : contrôler l'état des contrôles

        // Créer les animations spécifiques au joueur
        this.createAnimations();
    }

    createAnimations() {
        const anims = this.scene.anims;
        const directions = ['down', 'left', 'right', 'up'];
        const frameStarts = [0, 4, 8, 12];

        directions.forEach((direction, index) => {
            if (!anims.exists(`player-walk-${direction}`)) {
                anims.create({
                    key: `player-walk-${direction}`,
                    frames: anims.generateFrameNumbers('playerWalk', { start: frameStarts[index], end: frameStarts[index] + 3 }),
                    frameRate: 8,
                    repeat: -1,
                });
            }

            if(!anims.exists(`player-idle-${direction}`)) {
                // Créer une animation d'attente pour chaque direction
                anims.create({
                    key: `player-idle-${direction}`,
                    frames: [{ key: 'playerIdle', frame: frameStarts[index] }],
                });
            }
        });

        this.scene.events.emit('player-sprite-ready', this.sprite);
    }

    // Méthodes pour contrôler l'état des contrôles
    enableControls() {
        this.controlsEnabled = true;
    }

    disableControls() {
        this.controlsEnabled = false;
        this.stop();
        this.sprite.play(`player-idle-${this.currentDirection}`, true);
    }

    handleInput(cursors) {
        // Vérifier si le joueur existe
        if (!this.sprite || !this.sprite.anims) return;
        
        // Vérifier si les contrôles sont activés
        if (!this.controlsEnabled) {
            this.stop();
            this.sprite.play(`player-idle-${this.currentDirection}`, true);
            return;
        }

        // Vérifier si le dialogue est actif - si oui, ne pas traiter les inputs
        if (this.scene.isDialogueActive) {
            this.stop();
            this.sprite.play(`player-idle-${this.currentDirection}`, true);
            return;
        }

        // Vérifier si les cursors existent (peuvent être supprimés temporairement)
        if (!cursors || !cursors.up) {
            this.stop();
            this.sprite.play(`player-idle-${this.currentDirection}`, true);
            return;
        }

        const directionKeys = {
            up: 'player-walk-up',
            down: 'player-walk-down',
            left: 'player-walk-left',
            right: 'player-walk-right'
        };

        for (const [direction, animationKey] of Object.entries(directionKeys)) {
            if (cursors[direction] && cursors[direction].isDown) {
                this.move(direction);
                this.currentDirection = direction;
                this.sprite.play(animationKey, true);
                return;
            }
        }

        this.stop();
        this.sprite.play(`player-idle-${this.currentDirection}`, true);
    }
}