import BaseScene from './BaseScene';

export class Sandbox extends BaseScene {
  constructor() {
    super({ 
      key: 'Sandbox', 
      mapData: { 
        key: 'sandboxTilemap',
        playerStart: { x: 400, y: 300 },
        collideLayers: ['sandboxlayer1']
      }, 
      debug: true,
      enableChatbot: true,
      enableExhibition: true,
    });
    this.customObjects = [];
  }

  create(data) {
    super.create(data);
    console.log('Sandbox - create called.');
    if (data.entryFrom) {
      console.log(`Entrée dans Sandbox depuis ${data.entryFrom}`);
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