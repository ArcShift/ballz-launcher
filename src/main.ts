

document.addEventListener('DOMContentLoaded', () => {

    StartGame('game-container');

});

import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { CampaignSelection } from './scenes/CampaignSelection';
import { AUTO, Game, Scale } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { MapEditor } from './scenes/MapEditor';
import * as Phaser from 'phaser';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
export const GW = 1024;
export const GH = 768;
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: GW,
    height: GH,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 600, // Enabled gravity for the physics puzzle gameplay!
                x: 0
            },
            debug: false
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        CampaignSelection,
        MainGame,
        GameOver,
        MapEditor
    ],
    callbacks: {
        postBoot: function (game: Phaser.Game) {
            const fpsTextElement = document.getElementById('fps-counter');
            let lastUpdateTime = 0;
            const updateInterval = 500;

            game.events.on('poststep', () => {
                const now = performance.now();

                if (now - lastUpdateTime >= updateInterval) {
                    const currentFps = Math.round(game.loop.actualFps);
                    if (fpsTextElement) {
                        fpsTextElement.innerText = `FPS: ${currentFps}`;
                    }
                    lastUpdateTime = now;
                }
            });
        }
    }
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

