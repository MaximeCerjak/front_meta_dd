import Phaser from 'phaser';
import LegendUI from '../ui/LegendUI';

export default class InteractionManager {
  constructor(scene, tilemap, player, uiOptions = {}) {
    this.scene = scene;
    this.tilemap = tilemap;
    this.player = player;
    this.interactiveTiles = [];
    this.currentInteraction = null;
    this.interactionZones = [];
    this.uiOptions = uiOptions;
    this.legendUI = uiOptions.legendUI || new LegendUI(scene);
    
    this.initInteractiveTiles();
  }

  initInteractiveTiles() {
    console.log(`=== Initialisation des tuiles interactives pour ${this.scene.scene.key} ===`);
    
    this.tilemap.layers.forEach(layer => {
      const tileLayer = this.tilemap.getLayer(layer.name).tilemapLayer;
      
      tileLayer.forEachTile(tile => {
        const p = tile.properties;
        
        if (p.action === true && p.legend) {
          console.log(`Tuile interactive trouvée à [${tile.x},${tile.y}]: "${p.legend.substring(0, 30)}..."`);
          
          const zone = this.scene.add.zone(
            tile.getCenterX(),
            tile.getCenterY(),
            this.tilemap.tileWidth * 1.5, 
            this.tilemap.tileHeight * 1.5
          );
          
          this.scene.physics.world.enable(zone);
          zone.body.setAllowGravity(false);
          zone.body.moves = false;
          
          zone.interactionData = {
            tileX: tile.x,
            tileY: tile.y,
            legend: p.legend,
            layerName: layer.name,
            delay: p.interactionDelay || 0 
          };
          
          this.interactionZones.push(zone);
          
          let overlapTimer = null;
          
          const overlap = this.scene.physics.add.overlap(
            this.player.sprite,
            zone,
            () => {
              if (!overlapTimer && zone !== this.currentInteraction) {
                overlapTimer = this.scene.time.delayedCall(
                  zone.interactionData.delay,
                  () => {
                    this.handleInteraction(zone);
                    overlapTimer = null;
                  }
                );
              }
            },
            (player, zoneObj) => {
              const isOverlapping = this.scene.physics.world.overlap(player, zoneObj);
              if (!isOverlapping && overlapTimer) {
                overlapTimer.destroy();
                overlapTimer = null;
              }
              return true;
            },
            this.scene
          );

          this.interactiveTiles.push({ zone, overlap });
        }
      });
    });
    
    console.log(`InteractionManager: ${this.interactiveTiles.length} tuile(s) interactive(s) trouvée(s)`);
  }

  createLegendUI() {
    this.legendContainer = this.scene.add.container(0, 0);
    this.legendContainer.setDepth(1000);
    this.legendContainer.setVisible(false);
    this.legendBackground = this.scene.add.rectangle(0, 0, 400, 200, 0x000000, 0.8);
    this.legendBackground.setStrokeStyle(2, 0xffffff);
    this.legendText = this.scene.add.text(0, 0, '', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 360 },
      padding: { x: 10, y: 10 }
    });
    this.legendText.setOrigin(0.5);
    this.closeHint = this.scene.add.text(0, 80, '[Déplacez-vous pour fermer]', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#cccccc',
      align: 'center'
    });
    this.closeHint.setOrigin(0.5);
    this.legendContainer.add([this.legendBackground, this.legendText, this.closeHint]);
    
    this.updateLegendPosition();
  }

  updateLegendPosition() {
    const camera = this.scene.cameras.main;
    this.legendContainer.setPosition(
      camera.centerX,
      camera.centerY - 150 
    );
  }

  handleInteraction(zone) {
    console.log('handleInteraction appelée pour zone:', zone.interactionData);
    
    if (this.currentInteraction === zone && this.legendUI.isVisible) {
      console.log('Interaction déjà active, skip');
      return;
    }
    
    this.currentInteraction = zone;
    this.showLegend(zone.interactionData.legend);
  }

  showLegend(text) {
    this.legendUI.show(text, {
      position: 'center', 
      onShown: () => {
        this.setupCloseListener();
      }
    });
  }

  hideLegend() {
    this.legendUI.hide({
      onHidden: () => {
        this.currentInteraction = null;
        this.removeCloseListener();
      }
    });
  }

  setupCloseListener() {
    this.interactionStartPos = {
      x: this.player.sprite.x,
      y: this.player.sprite.y
    };
    
    this.movementCheckEvent = this.scene.time.addEvent({
      delay: 100, 
      callback: () => {
        const currentPos = {
          x: this.player.sprite.x,
          y: this.player.sprite.y
        };
        
        const distance = Phaser.Math.Distance.Between(
          this.interactionStartPos.x,
          this.interactionStartPos.y,
          currentPos.x,
          currentPos.y
        );
        
        if (distance > 10) {
          this.hideLegend();
        }
      },
      loop: true
    });
  }

  removeCloseListener() {
    if (this.movementCheckEvent) {
      this.movementCheckEvent.destroy();
      this.movementCheckEvent = null;
    }
  }

  update() {
    if (this.legendUI.isVisible) {
      this.legendUI.updatePosition();
    }

    if (this.currentInteraction) {
      const stillOverlapping = this.scene.physics.world.overlap(
        this.player.sprite,
        this.currentInteraction
      );
      
      if (!stillOverlapping && !this.legendUI.isVisible) {
        this.currentInteraction = null;
      }
    }
  }

  destroy() {
    this.interactiveTiles.forEach(({ zone, overlap }) => {
      if (overlap && overlap.destroy) overlap.destroy();
      if (zone) zone.destroy();
    });
    
    if (this.legendUI && !this.uiOptions?.legendUI) {
      this.legendUI.destroy();
    }
    
    this.removeCloseListener();
    
    this.interactiveTiles = [];
    this.interactionZones = [];
  }
}