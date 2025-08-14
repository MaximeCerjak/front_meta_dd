// src/scenes/Welcomeisle.js
import BaseScene from './BaseScene';

export class WelcomeIsle extends BaseScene {
    constructor() {
        super({ 
            key: 'Welcomeisle',
            mapData: {
                key: 'welcomeisleTilemap',
                playerStart: { x: 400, y: 300 },
                collideLayers: ['welcomeislelayer1']
            },
            debug: true,
            enableChatbot: true,
            interactionUIConfig: {
                style: {
                    // Couleurs thème pierre mystique
                    backgroundColor: 0x2a2520, 
                    backgroundAlpha: 0.92,
                    borderColor: 0x8b7355, 
                    borderWidth: 3,
                    padding: 25,
                    
                    // Style de texte harmonisé
                    textStyle: {
                        fontFamily: 'serif, Times, Georgia',
                        fontSize: '18px',
                        color: '#f4e6d2', 
                        align: 'left',
                        wordWrap: { width: 340 },
                        stroke: '#2a2520',
                        strokeThickness: 1,
                        shadow: {
                            offsetX: 1,
                            offsetY: 1,
                            color: '#000000',
                            blur: 2,
                            fill: true
                        }
                    },
                    
                    // Style du texte d'aide
                    hintStyle: {
                        fontFamily: 'serif, Times, Georgia',
                        fontSize: '11px',
                        color: '#c49b7a',
                        align: 'center',
                        fontStyle: 'italic',
                        stroke: '#2a2520',
                        strokeThickness: 0.5
                    }
                }
            }
        });
        this.customObjects = [];
    }

    create(data) {
        super.create(data);
        console.log('WelcomeIsle - create called', data);
        if (data.entryFrom) {
            console.log(`Entrée dans WelcomeIsle depuis ${data.entryFrom}`);
        }

        // Debug: afficher les layers disponibles
        console.log('Layers disponibles dans WelcomeIsle:', 
            this.gameMap.layers.map(l => l.layer.name));
    }

    update(time, delta) {
        super.update(time, delta);
    }

    destroy() {
        this.customObjects.forEach(obj => obj.destroy());
        this.customObjects = [];
        super.destroy();
    }
}
