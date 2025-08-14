// src/scenes/MuseumReception.js
import BaseScene from './BaseScene';

export class MuseumReception extends BaseScene {
    constructor() {
        super({ 
            key: 'Museumreception',
            mapData: {
                key: 'museumreceptionTilemap',
                playerStart: { x: 400, y: 300 },
                playerDepth: 1,
                collideLayers: ['museumreceptionlayer1', 'museumreceptionlayer2']
            },
            debug: true,
            enableChatbot: true,
            interactionUIConfig: {
                style: {
                    backgroundColor: 0x2c1810,
                    borderColor: 0xd4af37,
                    textStyle: {
                        fontFamily: 'Georgia',
                        fontSize: '18px'
                    }
                }
            }
        });
    }

    create(data) {
        super.create(data);
        console.log('MuseumReception - create called.');
        if (data.entryFrom) {
            console.log(`Entrée dans MuseumReception depuis ${data.entryFrom}`);
        }

        // Debug afficher les layers disponibles
        console.log('Layers disponibles dans MuseumReception:', 
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
