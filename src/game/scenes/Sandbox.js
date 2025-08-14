// src/scenes/Sandbox.js
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
      enableChatbot: true
    });
    this.customObjects = [];
  }

  create(data) {
    super.create(data);
    console.log('Sandbox - create called.');
    if (data.entryFrom) {
      console.log(`Entrée dans Sandbox depuis ${data.entryFrom}`);
    }
    
    // Debug: afficher les layers disponibles
    console.log('Layers disponibles dans Sandbox:', 
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