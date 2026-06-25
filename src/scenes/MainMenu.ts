import { Scene, GameObjects } from 'phaser';
import { GW, GH } from '../main';
import { loadSettings } from './Settings';

const MENUS = [
    { title: 'Campaign', scene: 'Campaign', desc: 'Can you reach the end?' },
    // { title: 'Seed Game', scene: 'SeedGame', desc: 'Random Level Generator' },
    // { title: 'Endless', scene: 'Game', desc: 'There is no end... until you lose' },
    { title: 'Training', scene: 'Game', desc: 'You can test every balls here' },
    { title: 'Tutorial', scene: 'Tutorial', desc: 'Learn about how to play' },
    { title: 'Map Editor', scene: 'MapEditor', desc: 'Create your own map' },
    { title: 'Settings', scene: 'Settings', desc: 'Settings' },
    // { title: 'Credits', scene: 'Credits', desc: 'Credits' },
    // { title: 'Test', scene: 'Test', desc: 'Dev Test' },
]
export class MainMenu extends Scene {
    logo: GameObjects.Image;
    title: GameObjects.Text;
    descriptionText: GameObjects.Text;
    fullscreenButton: GameObjects.Text;

    constructor() {
        super('MainMenu');
    }

    create() {
        this.add.image(GW / 2, GH / 2, 'background').setDisplaySize(GW, GH);

        const settings = loadSettings();
        this.registry.set('soundVolume', settings.soundVolume);
        this.registry.set('musicVolume', settings.musicVolume);

        if (!this.registry.get('musicStarted')) {
            this.sound.play('main-theme', { loop: true, volume: settings.musicVolume });
            this.registry.set('musicStarted', true);
        }

        this.title = this.add.text(GW / 2, 150, 'Hyper Ballz', {
            fontFamily: 'Fredoka', fontSize: 50, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.descriptionText = this.add.text(512, GH - 100, '', {
            fontFamily: 'Fredoka',
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        // Add fullscreen button
        this.fullscreenButton = this.add.text(GW - 30, 30, '⛶', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.fullscreenButton.setInteractive({ useHandCursor: true });
        this.fullscreenButton.on('pointerover', () => {
            this.fullscreenButton.setColor('#ffcc00');
        });

        this.fullscreenButton.on('pointerout', () => {
            this.fullscreenButton.setColor('#ffffff');
        });

        this.fullscreenButton.on('pointerdown', () => {
            this.scale.toggleFullscreen();
        });

        MENUS.forEach((menu, index) => {
            const x = 512;
            const y = 200 + (index + 1) * 50;
            const menuItem = this.add.text(x, y, menu.title, {
                fontFamily: 'Fredoka',
                fontSize: '24px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);

            menuItem.setInteractive({ useHandCursor: true });

            menuItem.on('pointerover', () => {
                menuItem.setColor('#ffcc00');
                this.descriptionText.setText(menu.desc);
            });

            menuItem.on('pointerout', () => {
                menuItem.setColor('#ffffff');
                this.descriptionText.setText('');
            });

            menuItem.on('pointerdown', () => {
                if (menu.scene === 'Exit') {
                    this.game.destroy(true);
                } else if (['Game', 'SeedGame', 'Campaign', 'Tutorial', 'Test', 'MapEditor', 'Settings'].includes(menu.scene)) {
                    this.scene.start(menu.scene, { mode: menu.title });
                } else {
                    this.descriptionText.setText(`[ ${menu.scene} ] is coming soon!`);
                    this.cameras.main.shake(200, 0.01);
                }
            });
        });

    }
}
