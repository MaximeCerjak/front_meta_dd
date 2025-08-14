// src/objects/InteractionManager.js
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
    
    // Créer l'UI (peut être passée en paramètre ou créée ici)
    this.legendUI = uiOptions.legendUI || new LegendUI(scene);
    
    this.initInteractiveTiles();
  }

  initInteractiveTiles() {
    console.log(`=== Initialisation des tuiles interactives pour ${this.scene.scene.key} ===`);
    
    this.tilemap.layers.forEach(layer => {
      const tileLayer = this.tilemap.getLayer(layer.name).tilemapLayer;
      
      tileLayer.forEachTile(tile => {
        const p = tile.properties;
        
        // Chercher les tuiles avec action=true et une légende
        if (p.action === true && p.legend) {
          console.log(`Tuile interactive trouvée à [${tile.x},${tile.y}]: "${p.legend.substring(0, 30)}..."`);
          
          // Créer une zone d'interaction autour de la tuile
          const zone = this.scene.add.zone(
            tile.getCenterX(),
            tile.getCenterY(),
            this.tilemap.tileWidth * 1.5, // Zone un peu plus large pour faciliter l'interaction
            this.tilemap.tileHeight * 1.5
          );
          
          this.scene.physics.world.enable(zone);
          zone.body.setAllowGravity(false);
          zone.body.moves = false;
          
          // Stocker les données de l'interaction
          zone.interactionData = {
            tileX: tile.x,
            tileY: tile.y,
            legend: p.legend,
            layerName: layer.name,
            delay: p.interactionDelay || 0 // Délai optionnel avant affichage
          };
          
          this.interactionZones.push(zone);
          
          // Variables pour gérer le délai
          let overlapTimer = null;
          
          // Configurer l'overlap avec le joueur
          const overlap = this.scene.physics.add.overlap(
            this.player.sprite,
            zone,
            () => {
              if (!overlapTimer && zone !== this.currentInteraction) {
                // Démarrer le timer
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
              // ProcessCallback : vérifier si on sort de la zone
              const isOverlapping = this.scene.physics.world.overlap(player, zoneObj);
              if (!isOverlapping && overlapTimer) {
                // Annuler le timer si on sort avant le délai
                overlapTimer.destroy();
                overlapTimer = null;
              }
              return true;
            },
            this.scene
          );
          
          // Stocker la référence pour le cleanup
          this.interactiveTiles.push({ zone, overlap });
        }
      });
    });
    
    console.log(`InteractionManager: ${this.interactiveTiles.length} tuile(s) interactive(s) trouvée(s)`);
  }

  createLegendUI() {
    // Conteneur principal pour la légende
    this.legendContainer = this.scene.add.container(0, 0);
    this.legendContainer.setDepth(1000); // Au-dessus de tout
    this.legendContainer.setVisible(false);
    
    // Fond semi-transparent
    this.legendBackground = this.scene.add.rectangle(0, 0, 400, 200, 0x000000, 0.8);
    this.legendBackground.setStrokeStyle(2, 0xffffff);
    
    // Texte de la légende
    this.legendText = this.scene.add.text(0, 0, '', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 360 },
      padding: { x: 10, y: 10 }
    });
    this.legendText.setOrigin(0.5);
    
    // Indicateur "Appuyez sur E pour fermer" (optionnel)
    this.closeHint = this.scene.add.text(0, 80, '[Déplacez-vous pour fermer]', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#cccccc',
      align: 'center'
    });
    this.closeHint.setOrigin(0.5);
    
    // Ajouter les éléments au conteneur
    this.legendContainer.add([this.legendBackground, this.legendText, this.closeHint]);
    
    // Positionner le conteneur (centré en haut de l'écran)
    this.updateLegendPosition();
  }

  updateLegendPosition() {
    const camera = this.scene.cameras.main;
    this.legendContainer.setPosition(
      camera.centerX,
      camera.centerY - 150 // Position en haut de l'écran
    );
  }

  handleInteraction(zone) {
    console.log('handleInteraction appelée pour zone:', zone.interactionData);
    
    // Si on est déjà en train d'afficher cette interaction, ne rien faire
    if (this.currentInteraction === zone && this.legendUI.isVisible) {
      console.log('Interaction déjà active, skip');
      return;
    }
    
    // Nouvelle interaction
    this.currentInteraction = zone;
    this.showLegend(zone.interactionData.legend);
  }

  showLegend(text) {
    // Utiliser l'UI séparée avec position centrée
    this.legendUI.show(text, {
      position: 'center', // Changé de 'top' à 'center'
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
    // Sauvegarder la position initiale du joueur
    this.interactionStartPos = {
      x: this.player.sprite.x,
      y: this.player.sprite.y
    };
    
    // Créer un événement qui vérifie le mouvement
    this.movementCheckEvent = this.scene.time.addEvent({
      delay: 100, // Vérifier toutes les 100ms
      callback: () => {
        const currentPos = {
          x: this.player.sprite.x,
          y: this.player.sprite.y
        };
        
        // Si le joueur s'est déplacé de plus de 10 pixels
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
    // Mettre à jour la position de l'UI si elle est visible
    if (this.legendUI.isVisible) {
      this.legendUI.updatePosition();
    }
    
    // Vérifier si on est toujours dans une zone d'interaction
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
    // Nettoyer les zones et overlaps
    this.interactiveTiles.forEach(({ zone, overlap }) => {
      if (overlap && overlap.destroy) overlap.destroy();
      if (zone) zone.destroy();
    });
    
    // Nettoyer l'UI (seulement si on l'a créée nous-même)
    if (this.legendUI && !this.uiOptions?.legendUI) {
      this.legendUI.destroy();
    }
    
    // Nettoyer les événements
    this.removeCloseListener();
    
    this.interactiveTiles = [];
    this.interactionZones = [];
  }
}