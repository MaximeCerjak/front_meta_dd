// src/game/scenes/IntroScene.js
import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import GameMap from '../objects/GameMap';
// import Player from '../objects/Player';
import PlayerManager from '../objects/PlayerManager';
import NPC from '../objects/NPC';
import TeleporterManager from '../objects/TeleporterManager';

import DialogueBox from '../ui/DialogueBox';
import receptionistDialogue from '../data/dialogues/intro/receptionistDialogue.json';

export class Intro extends Scene {
  constructor() {
    super({ key: 'Intro' });
    this.mapData = null;
    this.avatarData = null;
    this.gameMap = null;
    this.player = null;
    this.receptionist = null;
    this.cursors = null;
    this.dialogueBox = null;
    this.isDialogueActive = false;
    this.teleporterManager = null; // 💡 Gère les téléporteurs Tiled
    this.portal = null;            // 🪄 Backdoor portail
    this.portalActive = false;     // 🔒 État du backdoor
  }

  init(data) {
    if (data) {
      console.log('IntroScene - Data received:', data);
      if (data.avatarData) this.avatarData = data.avatarData;
      if (data.mapData) this.mapData = data.mapData;
    }
  }

  preload() {
    console.log('IntroScene - preload called.');
    this.load.on('progress', (value) => {
      console.log('IntroScene - Loading progress: ' + Math.round(value * 100) + '%');
    });
    this.load.on('complete', () => {
      console.log('IntroScene - All additional assets loaded.');
    });
  }

  create() {
    console.log('IntroScene - create called.');
    if (!this.mapData) {
      console.error('IntroScene - Map data missing!');
      return;
    }

    this.cursors = this.input.keyboard.createCursorKeys();

    this.createGameMap({
      key: 'introTilemap',
      tilesets: [
        { name: 'adminlayer1', key: 'adminlayer1' },
        { name: 'adminlayer2', key: 'adminlayer2' }
      ],
      layerFiles: [
        { name: 'adminlayer1', collides: true, depth: 0 },
        { name: 'adminlayer2', collides: false, depth: 2 }
      ]
    });

    this.player = PlayerManager.createPlayer(this, 0, 0);
    
    // on crée le TeleporterManager
    this.teleporterManager = new TeleporterManager(this, this.gameMap.tilemap, this.player);

    // SI on arrive par téléport :
    if (this.mapData?.entryFrom) {
        const entryZone = this.teleporterManager.getEntryZone(this.mapData.entryFrom);
        if (entryZone) {
            // coord monde du tile inverse
            const tw = this.gameMap.tilemap.tileWidth;
            const th = this.gameMap.tilemap.tileHeight;
            const wx = entryZone.teleporterData.tileX * tw + tw/2 + this.gameMap.mapOffsetX;
            const wy = entryZone.teleporterData.tileY * th + th/2 + this.gameMap.mapOffsetY;

            // on “place” le joueur juste au-dessus de la tuile
            this.player.sprite.setPosition(wx, wy - th/2);

            // petite animation de “sortie” si tu veux :
            this.player.sprite.play('player-walk-down', true);
            this.time.delayedCall(200, () => {
            this.player.sprite.play('player-idle-down');
            });
        }
    } else {
        // spawn par défaut
        this.player.sprite.setPosition(400, 300);
    }

    // collisions & contrôle
    this.physics.add.collider(this.player.sprite, this.gameMap.layers[0]);
    this.player.enableControls();

    // **Relancer le suivi caméra**
    this.gameMap.setupCameraFollow(this.cameras.main);

    // fade in
    this.cameras.main.fadeIn(300, 0, 0, 0);
    this.createNPCs();

    this.physics.world.createDebugGraphic();

    // 🪄 Backdoor : portail dev activable par "P"
    this.input.keyboard.on('keydown-P', () => {
      if (!this.portalActive && !this.isDialogueActive) {
        console.warn('DEBUG: Portail de backdoor activé !');
        this.spawnDevPortal(95, 150);
      }
    });

    console.log('IntroScene - All resources ready.');
    EventBus.emit('current-scene-ready', this);
  }

  createGameMap(mapData) {
    console.log('IntroScene - Creating game map.');
    this.gameMap = new GameMap(this, mapData);
    this.gameMap.create();
  }

  createNPCs() {
    console.log('IntroScene - Creating NPCs.');

    this.dialogueBox = new DialogueBox(this, 2, 420, 600, 152, EventBus);

    this.receptionist = new NPC(this, 450, 162, 'receptionist', {
      type: 'patrol',
      speed: 40,
      range: 72,
      target: this.player,
      interactionType: 'input',
      interactionCallback: () => {
        this.startDialogue();
      },
    });

    EventBus.on('login', () => {
      console.log('Redirection vers la connexion...');
      EventBus.emit('trigger-login');
    });

    EventBus.on('signup', () => {
      console.log('Redirection vers l\'inscription...');
      EventBus.emit('trigger-signup');
    });

    EventBus.on('close-dialogue', () => {
      console.log('Fermeture de la boîte de dialogue.');
      this.endDialogue();
    });

    EventBus.on('dialogue-end', () => {
      console.log('Fin du dialogue.');
      this.endDialogue();
    });

    EventBus.on('player-logged-in', () => {
      console.log('Joueur connecté. Réactivation du gameplay.');
      this.endDialogue();
    });
  }

  startDialogue() {
    console.log('Démarrage du dialogue');
    this.isDialogueActive = true;
    if (this.player) this.player.disableControls();
    this.dialogueBox.show(receptionistDialogue, 'start');
  }

  endDialogue() {
    console.log('Fin du dialogue');
    this.isDialogueActive = false;
    if (this.player) this.player.enableControls();
    this.dialogueBox.hide();
    if (this.receptionist) this.receptionist.startBehavior('patrol');
  }

  // 🪄 Backdoor dev : spawn un portail sur la touche P
  spawnDevPortal(x, y) {
    console.log('DEBUG: Portail dev apparu !');
    this.portal = this.physics.add.staticImage(x, y, 'portal');
    this.portal.setDepth(1);
    this.portalActive = true;

    this.tweens.add({
      targets: this.portal,
      scale: 1.1,
      yoyo: true,
      repeat: -1,
      duration: 500
    });

    this.physics.add.overlap(this.player.sprite, this.portal, () => {
      this.teleportToSandbox();
    }, null, this);
  }

  teleportToSandbox() {
    console.log('DEBUG: Téléportation via portail dev vers SandboxScene');
    this.portal.destroy();
    this.portalActive = false;

    const playerState = {
      position: this.player.sprite.getCenter(),
      map: this.mapData.name
    };

    this.scene.start('Sandbox', { playerState });
  }

  update() {
    if (PlayerManager.getPlayer()) {
      PlayerManager.getPlayer().handleInput(this.cursors);
    }
  }

  destroy() {
    if (this.dialogueBox) this.dialogueBox.destroy();
    super.destroy();
  }
}
