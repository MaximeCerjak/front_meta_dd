import { Boot } from './scenes/Boot';
import { Intro } from './scenes/Intro';
import { WelcomeIsle } from './scenes/WelcomeIsle';
import { MuseumReception } from './scenes/MuseumReception';
import { ExhibitionRoom } from './scenes/ExhibitionRoom';
import { Sandbox } from './scenes/Sandbox';
import Phaser from 'phaser';

import RexAwaitLoaderPlugin from 'phaser3-rex-plugins/plugins/awaitloader-plugin.js';

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 704,
    height: 576,
    parent: 'game-container',
    backgroundColor: '#000000',
    scene: [
        Boot,
        WelcomeIsle,
        Intro,
        MuseumReception,
        ExhibitionRoom,
        Sandbox
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    plugins: {
        global: [
            { key: 'rexAwaitLoader', plugin: RexAwaitLoaderPlugin, start: true }
        ]
    }
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

};

export default StartGame;
