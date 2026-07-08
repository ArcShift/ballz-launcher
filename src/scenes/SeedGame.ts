import { Scene } from 'phaser';
import { generateLevelFromSeed, formatSeed } from '../services/seedGenerator';

export class SeedGame extends Scene {
    constructor() {
        super('SeedGame');
    }

    create(data: { seed: number }) {
        const seedNum = data.seed || 1;
        const seedStr = formatSeed(seedNum);

        // Generate the level
        const levelData = generateLevelFromSeed(seedNum);

        // Pass it to the actual Game scene
        this.scene.start('Game', {
            mode: 'Seed',
            seed: seedNum,
            seedStr: seedStr,
            levelData: levelData
        });
    }
}
