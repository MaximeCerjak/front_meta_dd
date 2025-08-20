import BaseScene from './BaseScene';

export class ExhibitionRoom extends BaseScene {
    constructor() {
        super({ 
            key: 'Exhibitionroom',
            mapData: {
                key: 'exhibitionroomTilemap',
                playerStart: { x: 400, y: 300 },
                playerDepth: 1,
                collideLayers: ['exhibitionroomlayer1', 'exhibitionroomlayer2']
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
        console.log('ExhibitionRoom - create called.');
        if (data.entryFrom) {
            console.log(`Entrée dans ExhibitionRoom depuis ${data.entryFrom}`);
        }
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