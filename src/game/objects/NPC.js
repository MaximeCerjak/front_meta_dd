import Phaser from 'phaser';
import Character from './Character';

export default class NPC extends Character {
    constructor(scene, x, y, textureKey = 'receptionist', options = {}) {
        super(scene, x, y, textureKey);

        this.movementType = options.type || 'static'; // 'static', 'patrol', 'chase', etc.
        this.speed = options.speed || 50;
        this.range = options.range || 128; // Distance maximale pour 'patrol'
        this.target = options.target || null; // Cible pour 'chase' ou 'eyeChase'
        this.interactionType = options.interactionType || null; // 'detect', 'proximity', 'input'
        this.interactionCallback = options.interactionCallback || null; // Fonction appelée lors de l'interaction

        // État initial
        this.direction = 'left'; // Direction initiale
        this.startPosition = { x, y }; // Position de départ

        // Créer les animations
        this.createAnimations();

        // Démarrer le comportement initial
        this.startBehavior(this.movementType);

        // Configurer l'interaction si applicable
        if (this.interactionType) {
            this.setupInteraction();
        }
    }

    createAnimations() {
        const anims = this.scene.anims;
    
        if (!anims.exists('npc-walk-left')) {
            anims.create({
                key: 'npc-walk-left',
                frames: anims.generateFrameNumbers('receptionist', { start: 4, end: 7 }),
                frameRate: 8,
                repeat: -1,
            });
        }
    
        if (!anims.exists('npc-walk-right')) {
            anims.create({
                key: 'npc-walk-right',
                frames: anims.generateFrameNumbers('receptionist', { start: 8, end: 11 }),
                frameRate: 8,
                repeat: -1,
            });
        }
    
        if (!anims.exists('npc-walk-up')) {
            anims.create({
                key: 'npc-walk-up',
                frames: anims.generateFrameNumbers('receptionist', { start: 12, end: 15 }),
                frameRate: 8,
                repeat: -1,
            });
        }
    
        if (!anims.exists('npc-walk-down')) {
            anims.create({
                key: 'npc-walk-down',
                frames: anims.generateFrameNumbers('receptionist', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1,
            });
        }
    
        if (!anims.exists('npc-idle')) {
            anims.create({
                key: 'npc-idle',
                frames: anims.generateFrameNumbers('receptionist', { start: 0, end: 0 }),
                frameRate: 1,
                repeat: -1,
            });
        }
    }    
    
    // Configurer l'interaction en fonction du type
    setupInteraction() {
        switch (this.interactionType) {
            case 'detect':
                this.setupDetectInteraction();
                break;
            case 'proximity':
                this.setupProximityInteraction();
                break;
            case 'input':
                this.setupInputInteraction();
                break;
            default:
                console.warn('Invalid interaction type:', this.interactionType);
        }
    }

    setupDetectInteraction() {
        this.scene.physics.add.overlap(this.sprite, this.target.sprite, () => {
            if (this.interactionCallback) {
                this.interactionCallback();
            }
        });
    }

    setupProximityInteraction() {
        this.scene.physics.world.on('worldstep', () => {
            const distance = Phaser.Math.Distance.Between(
                this.sprite.x,
                this.sprite.y,
                this.target.sprite.x,
                this.target.sprite.y
            );

            if (distance <= this.range && this.interactionCallback) {
                this.interactionCallback();
            }
        });
    }

    setupInputInteraction() {
        const key = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        this.scene.physics.world.on('worldstep', () => {
            const distanceX = this.target.sprite.x - this.sprite.x;
            const distanceY = this.target.sprite.y - this.sprite.y;
            const distance = Phaser.Math.Distance.Between(
                this.sprite.x,
                this.sprite.y,
                this.target.sprite.x,
                this.target.sprite.y
            );
    
            if (distance <= this.range && Phaser.Input.Keyboard.JustDown(key)) {
                // Arrêter le mouvement
                this.sprite.setVelocity(0);
    
                // Calculer l'orientation vers le joueur
                if (Math.abs(distanceX) > Math.abs(distanceY)) {
                    if (distanceX > 0) {
                        this.direction = 'right';
                        this.sprite.setFrame(8); // Première frame de 'npc-walk-right'
                    } else {
                        this.direction = 'left';
                        this.sprite.setFrame(4); // Première frame de 'npc-walk-left'
                    }
                } else {
                    if (distanceY > 0) {
                        this.direction = 'down';
                        this.sprite.setFrame(0); // Première frame de 'npc-walk-down'
                    } else {
                        this.direction = 'up';
                        this.sprite.setFrame(12); // Première frame de 'npc-walk-up'
                    }
                }
    
                // Passer à l'état idle ou rester sur la frame courante
                if (this.scene.anims.exists('npc-idle')) {
                    this.sprite.play('npc-idle', true);
                }
    
                // Exécuter le callback d'interaction
                if (this.interactionCallback) {
                    this.interactionCallback();
                }
            }
        });
    }

    // Methodes de comportement
    startBehavior(type) {
        if (type === 'patrol') {
            this.startPatrol();
        } else if (type === 'chase') {
            this.startChase();
        } else if (type === 'eyeChase') {
            this.startEyeChase();
        } else {
            this.startIdle();
        }
    }

    startPatrol() {
        this.direction = 'left';
        this.sprite.setVelocityX(-this.speed);
        this.sprite.setDepth(1);
        this.sprite.play('npc-walk-left', true);
    
        // Activer la détection de collision avec les obstacles
        this.scene.physics.add.collider(this.sprite, this.scene.gameMap.layers[0], this.handlePatrolCollision, null, this);
    }
    
    handlePatrolCollision() {
        if (this.direction === 'left') {
            this.direction = 'right';
            this.sprite.setVelocityX(this.speed);
            this.sprite.play('npc-walk-right', true);
        } else {
            this.direction = 'left';
            this.sprite.setVelocityX(-this.speed);
            this.sprite.play('npc-walk-left', true);
        }
    }
    

    startChase() {
        if (!this.target) {
            console.warn('No target specified for chase behavior!');
            return;
        }
    
        this.scene.physics.world.on('worldstep', () => {
            // Calculer la direction vers la cible
            const directionX = this.target.sprite.x - this.sprite.x;
            const directionY = this.target.sprite.y - this.sprite.y;
            this.sprite.setDepth(1);
    
            const distance = Math.sqrt(directionX ** 2 + directionY ** 2);
    
            if (distance < 10) { // Si le NPC est proche de la cible
                this.sprite.setVelocity(0);
                this.sprite.play('npc-idle', true);
                return;
            }          
    
            // Normaliser la vitesse
            const velocityX = (directionX / distance) * this.speed;
            const velocityY = (directionY / distance) * this.speed;
    
            this.sprite.setVelocity(velocityX, velocityY);

            if (distance < 50) {
                this.sprite.setVelocity(velocityX * 0.5, velocityY * 0.5); // Réduire la vitesse
            } else {
                this.sprite.setVelocity(velocityX, velocityY);
            }  
    
            // Définir la bonne animation en fonction de la direction dominante
            if (Math.abs(velocityX) > Math.abs(velocityY)) {
                this.sprite.play(velocityX > 0 ? 'npc-walk-right' : 'npc-walk-left', true);
            } else {
                this.sprite.play(velocityY > 0 ? 'npc-walk-down' : 'npc-walk-up', true);
            }
        });
    }      

    startEyeChase() {
        if (!this.target) {
            console.warn('No target specified for eyeChase behavior!');
            return;
        }
    
        this.scene.physics.world.on('worldstep', () => {
            const directionX = this.target.sprite.x - this.sprite.x;
            const directionY = this.target.sprite.y - this.sprite.y;
            this.sprite.setDepth(1);

    
            if (Math.abs(directionX) <= this.range && Math.abs(directionY) <= this.range) {
                // Regarder le joueur sans se déplacer
                this.sprite.setVelocity(0);
    
                if (Math.abs(directionX) > Math.abs(directionY)) {
                    this.sprite.play(directionX > 0 ? 'npc-walk-right' : 'npc-walk-left', true);
                } else {
                    this.sprite.play(directionY > 0 ? 'npc-walk-down' : 'npc-walk-up', true);
                }
            } else {
                this.sprite.play('npc-idle', true);
            }
        });
    }    

    startIdle() {
        this.sprite.setVelocity(0);
        this.sprite.setDepth(1);
    
        const currentAnim = this.sprite.anims.currentAnim;
        if (currentAnim) {
            const frameIndex = currentAnim.key.includes('walk') ? 0 : this.sprite.anims.currentFrame.index;
            this.sprite.setFrame(frameIndex);
        } else {
            this.sprite.play('npc-idle', true);
        }
    }
    
}
