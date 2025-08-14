// src/game/scenes/BootScene.js
import { Scene } from 'phaser';
import ApiManager from '../../api/ApiManager';
import { EventBus } from '../EventBus';
import { ASSETS } from '../data/assets';

export class Boot extends Scene {
  constructor() {
    super({ key: 'BootScene' });
  }
  
  preload() {
    console.log('BootScene - preload called.');

    // --- 0. Charger les assets de base ---
    this.load.image('portal', ASSETS.environment.portal.path);

    // --- 1. Charger le profil user anonyme ---
    this.load.rexAwait((successCallback, failureCallback) => {
      ApiManager.getAnonymUser()
        .then((userData) => {
          console.log('BootScene - Anonym user data loaded:', userData);
          // Stockage pour transmission ultérieure
          this.anonymUserData = userData;
          successCallback();
        })
        .catch((error) => {
          console.error('BootScene - Failed to load anonym user data:', error);
          failureCallback(error);
        }
      );
    });

    // --- 1bis. Charger l'avatar ---
    this.load.rexAwait((successCallback, failureCallback) => {
      ApiManager.getAnonymAvatar()
        .then((avatarData) => {
          console.log('BootScene - Avatar data loaded:', avatarData);
          // Chargement des spritesheets à partir des données d'avatar
          this.load.spritesheet('playerWalk', ASSETS.player.walkSprite.path, {
            frameWidth: ASSETS.player.walkSprite.frameWidth,
            frameHeight: ASSETS.player.walkSprite.frameHeight,
          });
          this.load.spritesheet('playerIdle', ASSETS.player.idleSprite.path, {
            frameWidth: ASSETS.player.idleSprite.frameWidth,
            frameHeight: ASSETS.player.idleSprite.frameHeight,
          });
          // Stockage pour transmission ultérieure
          this.avatarData = avatarData;
          successCallback();
        })
        .catch((error) => {
          console.error('BootScene - Failed to load avatar data:', error);
          failureCallback(error);
        });
    });

    // --- 2. Charger les données de la carte ---
    this.load.rexAwait((successCallback, failureCallback) => {
      ApiManager.getMapById(1)
        .then(response => {
          if (response && response.map) {
            console.log('BootScene - Map data loaded:', response.map);
            this.mapData = response.map;
            // Chargement du tilemap JSON et des images des tilesets
            this.load.tilemapTiledJSON('introTilemap', ASSETS.map.introMap.jsonFile.path);
            ASSETS.map.introMap.layerFiles.forEach((layer, index) => {
              const tilesetName = index === 0 ? 'adminlayer1' : 'adminlayer2';
              this.load.image(tilesetName, layer.path);
            });
            successCallback();
          } else {
            failureCallback('Map data not found.');
          }
        })
        .catch(error => {
          failureCallback(error);
        });
    });

    // Charger les données de la réceptionniste
    this.load.rexAwait((successCallback, failureCallback) => {
      ApiManager.getAssetById(6)
        .then(response => {
          if (response) {
            console.log('BootScene - Receptionist data loaded:', response);
            this.receptionistData = response;
            this.load.spritesheet('receptionist', ASSETS.npcs.receptionist.path, {
              frameWidth: ASSETS.npcs.receptionist.frameWidth,
              frameHeight: ASSETS.npcs.receptionist.frameHeight,
            });
            successCallback();
          } else {
            failureCallback('Receptionist data not found.');
          }
        })
        .catch(error => {
          failureCallback(error);
        });
    });

    // Écouteur indiquant la fin du chargement de l'ensemble des assets
    this.load.on('complete', () => {
      console.log('BootScene - All assets loaded.');
      EventBus.emit('resources-ready');
    });
  }
  
  create() {
    console.log('BootScene - create called.');
    // Lancement IntroScene
    this.scene.start('Intro', { avatarData: this.avatarData, mapData: this.mapData });
  }
}
