import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        console.log('Preloader : Préchargement des ressources principales.');
    }

    create() {
        console.log('Preloader : Scène prête, émet un événement via EventBus.');
        EventBus.emit('current-scene-ready', this);
        this.scene.start('Intro');
    }
}
