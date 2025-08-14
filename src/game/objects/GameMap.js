// src/objects/GameMap.js
export default class GameMap {
  constructor(scene, mapData) {
    this.scene = scene;
    this.mapData = mapData;
    this.tilemap = null;
    this.tilesetImages = [];
    this.layers = [];
  }

  create() {
    console.log(`GameMap.create() - Chargement du tilemap: ${this.mapData.key}`);
    
    // 1️⃣ Création du tilemap depuis le JSON chargé
    this.tilemap = this.scene.make.tilemap({ key: this.mapData.key });
    
    console.log('Tilemap chargé:', this.tilemap);
    console.log('Tilesets:', this.tilemap.tilesets.map(ts => ts.name));
    console.log('Layers:', this.tilemap.layers.map(l => l.name));

    // 2️⃣ Chargement de chaque tileset déclaré dans le JSON
    this.tilemap.tilesets.forEach(ts => {
      const tilesetImage = this.tilemap.addTilesetImage(ts.name, ts.name);
      this.tilesetImages.push(tilesetImage);
    });

    // 3️⃣ Création dynamique des layers selon la définition JSON
    this.tilemap.layers.forEach((layerDef, index) => {
      // Récupération des propriétés Tiled (collides, depth...)
      const props = (layerDef.properties || []).reduce((acc, p) => {
        acc[p.name] = p.value;
        return acc;
      }, {});

      const layer = this.tilemap.createLayer(layerDef.name, this.tilesetImages, 0, 0);
      
      // Gestion de la profondeur (depth)
      if (props.depth != null) {
        // Utiliser la profondeur définie dans Tiled
        layer.setDepth(props.depth);
      } else {
        // Profondeur automatique basée sur l'ordre des layers
        // Layer 0 = profondeur 0 (arrière-plan)
        // Layer 1 = profondeur 1 (collision, au niveau du joueur)
        // Layer 2+ = profondeur 2+ (premier plan, au-dessus du joueur)
        layer.setDepth(index+1);
      }
      
      // ⚠️ Important : ne pas configurer les collisions ici
      // On laisse BaseScene s'en charger selon sa configuration
      
      this.layers.push(layer);
    });
    
    // 4️⃣ Configuration des propriétés de collision sur les tuiles
    this._setupTileCollisionProperties();
  }

  /**
   * Configure les propriétés de collision sur les tuiles individuelles
   * basées sur les propriétés définies dans Tiled
   */
  _setupTileCollisionProperties() {
    // Pour chaque tileset, on parcourt les tuiles avec propriétés
    this.tilemap.tilesets.forEach(tileset => {
      if (tileset.tileData) {
        // tileData contient les propriétés des tuiles individuelles
        Object.keys(tileset.tileData).forEach(tileId => {
          const tileProperties = tileset.tileData[tileId];
          if (tileProperties && tileProperties.collides === true) {
            // Configurer la collision pour cette tuile spécifique
            this.tilemap.setTileIndexCallback(
              parseInt(tileId) + tileset.firstgid, // GID réel de la tuile
              null, // pas de callback spécifique
              this.scene
            );
          }
        });
      }
    });
  }

  /**
   * Configure les collisions sur un layer spécifique
   * @param {string|number} layerSelector - nom ou index du layer
   * @param {Phaser.Physics.Arcade.Sprite} playerSprite - sprite du joueur
   */
  setupLayerCollisions(layerSelector, playerSprite) {
    const layer = this.getLayer(layerSelector);
    if (!layer) {
      console.warn(`Layer ${layerSelector} not found for collision setup`);
      return null;
    }

    // Méthode 1 : Collision par propriété (recommandée)
    layer.setCollisionByProperty({ collides: true });
    
    // Méthode 2 : Alternative si la méthode 1 ne fonctionne pas
    // layer.setCollisionByExclusion([-1], true);
    
    // Créer le collider entre le joueur et le layer
    const collider = this.scene.physics.add.collider(playerSprite, layer);
    
    return collider;
  }

  /**
   * Récupère un layer par nom ou index
   */
  getLayer(selector) {
    if (typeof selector === 'number') {
      return this.layers[selector];
    }
    return this.layers.find(layer => layer.layer.name === selector);
  }

  /**
   * Récupère tous les layers dont le nom correspond à un pattern
   */
  getLayersByPattern(pattern) {
    const regex = new RegExp(pattern);
    return this.layers.filter(layer => regex.test(layer.layer.name));
  }

  setupCameraFollow(camera, playerSprite) {
    camera.startFollow(playerSprite);
    camera.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
  }

  /**
   * Debug : affiche les propriétés de toutes les tuiles
   */
  debugTileProperties() {
    this.tilemap.layers.forEach((layerDef, layerIndex) => {
      console.log(`=== Layer ${layerIndex}: ${layerDef.name} ===`);
      const layer = this.layers[layerIndex];
      
      layer.forEachTile(tile => {
        if (tile.index > 0) { // Ignorer les tuiles vides
          const properties = tile.properties;
          if (Object.keys(properties).length > 0) {
            console.log(`Tuile [${tile.x},${tile.y}] ID:${tile.index}`, properties);
          }
        }
      });
    });
  }
}