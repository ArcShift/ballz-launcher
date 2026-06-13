import { Scene } from "phaser";

export class Test extends Scene {
    constructor() {
        super('Test');
    }

    preload() {
    }

    create() {
        // draw all 8 balls in a circle
        const centerX = 512;
        const centerY = 384;
        const radius = 200;

        for (let i = 0; i < 8; i++) {
            const x = centerX + radius * Math.cos(i * Math.PI / 4);
            const y = centerY + radius * Math.sin(i * Math.PI / 4);
            this.add.image(x, y, 'ball', i);
        }
    }
}