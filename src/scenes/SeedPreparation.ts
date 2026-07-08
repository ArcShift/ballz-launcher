import { Scene } from 'phaser';
import { GW, GH } from '../main';
import { playSound } from './Preloader';
import { parseSeedString, formatSeed } from '../services/seedGenerator';
import * as Phaser from 'phaser';

export class SeedPreparation extends Scene {
    private seedString: string = '';
    private seedText: Phaser.GameObjects.Text;

    constructor() {
        super('SeedPreparation');
    }

    create() {
        this.add.image(GW / 2, GH / 2, 'background').setDisplaySize(GW, GH);

        // Title
        this.add.text(GW / 2, 120, 'SEED MODE', {
            fontFamily: 'Fredoka', fontSize: 48, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(GW / 2, 180, 'Play a procedurally generated level.', {
            fontFamily: 'Arial', fontSize: '18px', color: '#aaaaaa'
        }).setOrigin(0.5);

        // Seed Display Box
        const box = this.add.rectangle(GW / 2, 280, 400, 80, 0x112233)
            .setStrokeStyle(4, 0x00ffff);
        
        this.seedText = this.add.text(GW / 2, 280, 'SEED-000000', {
            fontFamily: 'Courier New', fontSize: '36px', color: '#00ffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Randomize seed initially
        this.randomizeSeed();

        // Buttons
        const createBtn = (x: number, y: number, label: string, color: string, action: () => void) => {
            const btnBg = this.add.rectangle(x, y, 220, 60, 0x000000, 0.8)
                .setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(color).color);
            const btnText = this.add.text(x, y, label, {
                fontFamily: 'Fredoka', fontSize: '24px', color, stroke: '#000000', strokeThickness: 4
            }).setOrigin(0.5);

            btnBg.setInteractive({ useHandCursor: true });
            btnBg.on('pointerover', () => { btnBg.setFillStyle(0x222222); });
            btnBg.on('pointerout', () => { btnBg.setFillStyle(0x000000); });
            btnBg.on('pointerdown', () => { playSound(this, 'click'); action(); });
        };

        // Randomize Button
        createBtn(GW / 2 - 130, 400, '🎲 RANDOMIZE', '#ffcc00', () => {
            this.randomizeSeed();
        });

        // Type Seed Button
        createBtn(GW / 2 + 130, 400, '⌨ ENTER SEED', '#ffaa00', () => {
            this.promptSeedInput();
        });

        // Play Button
        createBtn(GW / 2, 520, '▶ PLAY SEED', '#00ff66', () => {
            const seedNum = parseSeedString(this.seedString);
            this.scene.start('SeedGame', { seed: seedNum });
        });

        // Back Button
        const backBtn = this.add.text(60, 50, 'BACK', {
            fontFamily: 'Fredoka', fontSize: '24px', color: '#ffffff', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        backBtn.on('pointerdown', () => { playSound(this, 'click'); this.scene.start('MainMenu'); });
    }

    private randomizeSeed() {
        const seed = Math.floor(Math.random() * 999999) + 1;
        this.setSeedString(formatSeed(seed));
    }

    private promptSeedInput() {
        const result = prompt('Enter a seed number (e.g. 1234):');
        if (result !== null) {
            const seed = parseSeedString(result);
            this.setSeedString(formatSeed(seed));
        }
    }

    private setSeedString(seedStr: string) {
        this.seedString = seedStr;
        this.seedText.setText(this.seedString);
    }
}
