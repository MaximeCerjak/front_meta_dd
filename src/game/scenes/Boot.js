// src/scenes/Boot.js
import Phaser from 'phaser';
import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { ASSETS } from '../data/assets';

/**
 * Boot : précharge tous les JSON de tilemap
 * et leurs tilesets avant de démarrer Intro
 */
export class Boot extends Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    console.log('Boot - preload called.');

    // Images globales
    this.load.image('portal', ASSETS.environment.portal.path);
    this.load.spritesheet('playerWalk', ASSETS.player.walkSprite.path, {
      frameWidth: ASSETS.player.walkSprite.frameWidth,
      frameHeight: ASSETS.player.walkSprite.frameHeight
    });
    this.load.spritesheet('playerIdle', ASSETS.player.idleSprite.path, {
      frameWidth: ASSETS.player.idleSprite.frameWidth,
      frameHeight: ASSETS.player.idleSprite.frameHeight
    });

    // JSON tilemaps
    ['intro', 'sandbox', 'welcomeisle', 'museumreception', 'exhibitionroom'].forEach(key => {
      const mapAsset = ASSETS.map[`${key}Map`];

      this.load.tilemapTiledJSON(`${key}Tilemap`, mapAsset.jsonFile.path);
      // Dès que la JSON est chargée, on charge ses tilesets
      this.load.once(
        Phaser.Loader.Events.FILE_COMPLETE + `-tilemapJSON-${key}Tilemap`,
        (_fileKey, _type, data) => {
          const json = data;
          json.tilesets.forEach(ts => {
            console.log(`Tileset trouvé dans le JSON: name="${ts.name}", image="${ts.image}"`);
            console.log('Paths disponibles dans layerFiles:', mapAsset.layerFiles.map(lf => lf.path));
            
            const asset = mapAsset.layerFiles.find(lf => {
              const matches = lf.path.endsWith(ts.image);
              console.log(`Test: "${lf.path}".endsWith("${ts.image}") = ${matches}`);
              return matches;
            });
            
            if (!asset) {
              console.error(`Aucun path ne correspond à l'image du tileset: ${ts.image}`);
              return;
            }
            
            this.load.image(ts.name, asset.path);
          });
          this.load.start();
        }
      );
    });

    // NPC & objets
    this.load.spritesheet('receptionist', ASSETS.npcs.receptionist.path, {
      frameWidth: ASSETS.npcs.receptionist.frameWidth,
      frameHeight: ASSETS.npcs.receptionist.frameHeight
    });
    // this.load.image('crate', ASSETS.objects.crate.path);

    this.load.on('complete', () => EventBus.emit('resources-ready'));
  }

  create() {
    console.log('Boot - create called.');
    this.scene.start('Intro');
  }
}