

document.addEventListener('DOMContentLoaded', () => {

    StartGame('game-container');

});

import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { CampaignSelection } from './scenes/CampaignSelection';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';

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
        GameOver
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

