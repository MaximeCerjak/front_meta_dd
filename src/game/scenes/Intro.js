// src/scenes/Intro.js
import BaseScene from './BaseScene';
import { EventBus } from '../EventBus';
import NPC from '../objects/NPC';
import DialogueBox from '../ui/DialogueBox';
import receptionistDialogue from '../data/dialogues/intro/receptionistDialogue.json';

export class Intro extends BaseScene {
  constructor() {
    super({
      key: 'Intro',
      mapData: { 
        key: 'introTilemap',
        playerStart: { x: 400, y: 300 },
        playerDepth: 1,
        collideLayers: ['adminlayer1', 'adminlayer2']
     },
      debug: true,
      enableChatbot: true
    });
    this.dialogueBox = null;
    this.receptionist = null;
    this.portal = null;
    this.portalActive = false;
    this.isDialogueActive = false;
  }

  create(data) {
    super.create(data);
    console.log('Intro - create called.');

    // NPC réceptionniste animé en patrouille
    this.receptionist = new NPC(this, 450, 162, 'receptionist', {
      type: 'patrol',
      speed: 40,
      range: 72,
      target: this.player,
      interactionType: 'input',
      interactionCallback: () => this.startDialogue()
    });

    // Dialogue box
    this.dialogueBox = new DialogueBox(this, 50, 350, 600, 150, EventBus);

    EventBus.emit('current-scene-ready', this);

    EventBus.on('login', () => {
      console.log("Redirection vers la connexion...");
      EventBus.emit('trigger-login');
    });

    EventBus.on('signup', () => {
      console.log("Redirection vers l'inscription...");
      EventBus.emit('trigger-signup');
    });

    EventBus.on('close-dialogue', () => {
      console.log("Fermeture de la boîte de dialogue.");
      this.endDialogue();
    });

    EventBus.on('dialogue-end', () => {
      console.log("Fin du dialogue.");
      this.endDialogue();
    });

    EventBus.on('player-logged-in', () => {
      console.log("Joueur connecté. Réactivation du gameplay.");
      this.endDialogue();
    });
  }

  /**
   * OVERRIDE: Ajouter les contrôles spécifiques à cette scène
   * Appelé automatiquement quand les contrôles Phaser sont réactivés
   */
  _setupSceneSpecificControls() {
    // Backdoor dev (touche P) - seulement si le chatbot n'est pas ouvert et pas en dialogue
    this.input.keyboard.on('keydown-P', () => {
      if (!this.isChatbotOpen && !this.portalActive && !this.isDialogueActive) {
        console.warn("DEBUG: Portail de backdoor activé !");
        this.spawnDevPortal(95, 150);
      }
    });
  }

  startDialogue() {
    this.isDialogueActive = true;
    this.player.disableControls();
    this.dialogueBox.show(receptionistDialogue, 'start');
  }

  endDialogue() {
    console.log("Fin du dialogue");
    this.isDialogueActive = false;
    if (this.player) this.player.enableControls();
    this.dialogueBox.hide();
    if (this.receptionist) this.receptionist.startBehavior('patrol');
  }

  spawnDevPortal(x, y) {
    this.portal = this.physics.add.staticImage(x, y, 'portal').setDepth(1);
    this.portalActive = true;
    this.tweens.add({ targets: this.portal, scale: 1.1, yoyo: true, repeat: -1, duration: 500 });
    this.physics.add.overlap(this.player.sprite, this.portal, () => this.teleportToSandbox(), null, this);
  }

  teleportToSandbox() {
    if (this.portal) {
      this.portal.destroy();
      this.portalActive = false;
    }
    this.scene.start('Sandbox', { entryFrom: 'Intro' });
  }

  destroy() {
    if (this.teleporterManager) this.teleporterManager.destroy();
    if (this.dialogueBox) this.dialogueBox.destroy();
    super.destroy();
  }
}