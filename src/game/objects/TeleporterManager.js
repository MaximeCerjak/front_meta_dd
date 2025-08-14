// src/objects/TeleporterManager.js
export default class TeleporterManager {
  constructor(scene, tilemap, player) {
    this.scene = scene;
    this.player = player;
    this.teleportZones = [];
    this.teleportCooldown = false; // Nouveau : empêcher les téléportations multiples
    this.initTeleporters(tilemap);
  }

  initTeleporters(tilemap) {
    console.log(`=== Initialisation téléporteurs pour ${this.scene.scene.key} ===`);
    tilemap.layers.forEach(layer => {
      const tileLayer = tilemap.getLayer(layer.name).tilemapLayer;
      console.log(`Analyse du layer: ${layer.name}`);
      
      tileLayer.forEachTile(tile => {
        const p = tile.properties;
        
        // Debug : afficher toutes les propriétés des tuiles non-vides
        // if (tile.index > 0 && Object.keys(p).length > 0) {
        //   console.log(`Tuile [${tile.x},${tile.y}] ID:${tile.index}`, p);
        // }
        
        if (p.teleporter && p.teleporter.trim() !== '') {
          console.log(`Téléporteur trouvé : ${p.teleporter} à [${tile.x},${tile.y}]`);
          const [from, to] = p.teleporter.split('/');
          const zone = this.scene.add.zone(
            tile.getCenterX(), tile.getCenterY(),
            tileLayer.tilemap.tileWidth,
            tileLayer.tilemap.tileHeight
          );
          this.scene.physics.world.enable(zone);
          zone.body.setAllowGravity(false);
          zone.body.moves = false;

          // Propriétés étendues pour le téléporteur
          zone.teleporterData = {
            from, 
            to,
            tileX: tile.x,
            tileY: tile.y,
            layerName: layer.name,
            // Nouvelles propriétés pour la direction de sortie
            exitDirection: p.exitDirection || 'down', // Direction de sortie par défaut
            exitOffset: p.exitOffset ? parseInt(p.exitOffset) : 32, // Distance de sortie en pixels
            // Propriétés pour l'animation d'entrée
            entryAnimation: p.entryAnimation !== 'false', // true par défaut
            entryDuration: p.entryDuration ? parseInt(p.entryDuration) : 500 // Durée animation entrée
          };
          
          this.teleportZones.push(zone);

          this.scene.physics.add.overlap(
            this.player.sprite, zone,
            () => this.handleTeleport(zone.teleporterData)
          );
        }
      });
    });
    
    console.log(`TeleporterManager: ${this.teleportZones.length} téléporteur(s) trouvé(s) dans ${this.scene.scene.key}`);
    this.teleportZones.forEach(zone => {
      console.log(`- Téléporteur ${zone.teleporterData.from}/${zone.teleporterData.to} (direction: ${zone.teleporterData.exitDirection})`);
    });
  }

  handleTeleport({ from, to }) {
    if (this.scene.scene.key !== from) return;
    if (this.teleportCooldown) return; // Empêcher les téléportations multiples
    
    console.log(`Téléportation déclenchée: ${from} -> ${to}`);
    this.teleportCooldown = true;
    this.player.disableControls();
    
    this.scene.cameras.main.fadeOut(300, 0, 0, 0, () =>
      this.scene.scene.start(to, { entryFrom: from })
    );
  }

  /**  
   * Trouve la zone d'entrée et calcule la position de sortie avec direction
   */
  getEntryZone(entryFromKey) {
    const targetKey = this.scene.scene.key;
    console.log(`Recherche zone d'entrée: venant de "${entryFromKey}" vers "${targetKey}"`);
    
    // Chercher le téléporteur qui va de la scène actuelle vers la scène d'origine
    const zone = this.teleportZones.find(z => {
      const match = z.teleporterData.from === targetKey && z.teleporterData.to === entryFromKey;
      console.log(`  Test zone: ${z.teleporterData.from}/${z.teleporterData.to} -> match: ${match}`);
      return match;
    });
    
    if (!zone) {
      console.warn(`Aucun téléporteur de retour trouvé pour ${entryFromKey} -> ${targetKey}`);
      console.log('Téléporteurs disponibles:', this.teleportZones.map(z => `${z.teleporterData.from}/${z.teleporterData.to}`));
    } else {
      console.log(`Zone d'entrée trouvée: ${zone.teleporterData.from}/${zone.teleporterData.to} à [${zone.teleporterData.tileX},${zone.teleporterData.tileY}]`);
    }
    
    return zone;
  }

  /**
   * Calcule la position de sortie en fonction de la direction du téléporteur
   */
  calculateExitPosition(zone) {
    const { tileWidth: tw, tileHeight: th } = this.scene.gameMap.tilemap;
    const { tileX, tileY, exitDirection, exitOffset } = zone.teleporterData;
    
    // Position de base de la tuile téléporteur
    let exitX = tileX * tw + tw / 2;
    let exitY = tileY * th + th / 2;
    
    // Utiliser un offset plus grand pour éviter de retriggerer le téléporteur
    const safeOffset = Math.max(exitOffset, 96); // Minimum 96 pixels = 3 tuiles

    // Ajuster selon la direction de sortie
    switch (exitDirection) {
      case 'up':
        exitY -= safeOffset;
        break;
      case 'down':
        exitY += safeOffset;
        break;
      case 'left':
        exitX -= safeOffset;
        break;
      case 'right':
        exitX += safeOffset;
        break;
      case 'center':
      default:
        // Pas de décalage, reste au centre
        break;
    }
    
    console.log(`Position de sortie calculée: [${exitX}, ${exitY}] (offset: ${safeOffset})`);
    return { x: exitX, y: exitY };
  }

  /**
   * Anime l'entrée du joueur selon la direction du téléporteur
   */
  animatePlayerEntry(zone, onComplete) {
    if (!zone.teleporterData.entryAnimation) {
      // Réactiver les téléportations après un délai même sans animation
      this.scene.time.delayedCall(1000, () => {
        this.teleportCooldown = false;
      });
      if (onComplete) onComplete();
      return;
    }

    const { exitDirection, entryDuration } = zone.teleporterData;
    const player = this.player;
    
    // Désactiver les contrôles pendant l'animation
    player.disableControls();
    
    // Validation de la direction et fallback
    let validDirection = exitDirection;
    let walkAnimationKey = `player-walk-${exitDirection}`;
    
    // Si la direction est 'center' ou si l'animation n'existe pas, utiliser une direction par défaut
    if (exitDirection === 'center' || !this.scene.anims.exists(walkAnimationKey)) {
      validDirection = 'down'; // Direction par défaut
      walkAnimationKey = `player-walk-${validDirection}`;
      console.log(`Direction '${exitDirection}' non supportée, utilisation de '${validDirection}'`);
    }
    
    // Jouer l'animation de marche dans la direction appropriée
    player.sprite.play(walkAnimationKey, true);
    player.currentDirection = validDirection;
    
    // Pour 'center', pas d'animation de mouvement, juste l'animation de marche puis idle
    if (exitDirection === 'center') {
      this.scene.time.delayedCall(entryDuration, () => {
        player.sprite.play(`player-idle-${validDirection}`, true);
        player.enableControls();
        // Réactiver les téléportations après l'animation
        this.scene.time.delayedCall(500, () => {
          this.teleportCooldown = false;
        });
        if (onComplete) onComplete();
      });
      return;
    }
    
    // Calculer la position de départ (avant la sortie du téléporteur)
    const finalPos = this.calculateExitPosition(zone);
    const startOffset = 20; // Pixels de recul pour l'effet de sortie
    
    let startX = finalPos.x;
    let startY = finalPos.y;
    
    switch (validDirection) {
      case 'up':
        startY += startOffset;
        break;
      case 'down':
        startY -= startOffset;
        break;
      case 'left':
        startX += startOffset;
        break;
      case 'right':
        startX -= startOffset;
        break;
    }
    
    // Positionner le joueur au point de départ
    player.sprite.setPosition(startX, startY);
    
    // Animer le mouvement vers la position finale
    this.scene.tweens.add({
      targets: player.sprite,
      x: finalPos.x,
      y: finalPos.y,
      duration: entryDuration,
      ease: 'Power2.easeOut',
      onComplete: () => {
        // Arrêter l'animation et réactiver les contrôles
        player.sprite.play(`player-idle-${validDirection}`, true);
        player.enableControls();
        // Réactiver les téléportations après l'animation + délai de sécurité
        this.scene.time.delayedCall(500, () => {
          this.teleportCooldown = false;
          console.log('Téléportations réactivées');
        });
        if (onComplete) onComplete();
      }
    });
  }

  destroy() {
    this.teleportZones.forEach(z => z.destroy());
    this.teleportZones = [];
  }
}