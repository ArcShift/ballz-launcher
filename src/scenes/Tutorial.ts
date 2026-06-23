import { Scene, GameObjects } from 'phaser';
import { GW, GH } from '../main';
import { playSound } from './Preloader';

const TUTORIAL_PAGES = [
    {
        title: "Welcome to Hyper Ballz!",
        text: "Drag backwards from the launcher to aim your shot.\nThe further you drag, the more powerful the launch!\n\nRelease to launch the ball into the arena.",
        images: [{ frame: '15', x: 0, y: 50, scale: 2 }]
    },
    {
        title: "Your Objective",
        text: "Navigate your balls into the Goal Portal to clear the stage.\nCollect Stars along the way to earn a higher score!\n\nBut be careful... avoid the Spikes or you'll lose your ball!",
        images: [
            { frame: '8', x: -80, y: 70, scale: 2 }, // Portal
            { frame: '48', x: 0, y: 70, scale: 1.5 }, // Star
            { frame: '9', x: 80, y: 70, scale: 2 }   // Spikes
        ]
    },
    {
        title: "Special Abilities",
        text: "Some balls have special powers! Click anywhere mid-air to activate:\n\n• Anti-Gravity Ball: Reverses gravity\n• Nitro Ball: Dashes towards your cursor\n• Matryoshka Ball: Splits into 3 smaller balls",
        images: [
            { frame: '3', x: -80, y: 90, scale: 1.5 },
            { frame: '5', x: 0, y: 90, scale: 1.5 },
            { frame: '7', x: 80, y: 90, scale: 1.5 }
        ]
    },
    {
        title: "Elemental Interactions",
        text: "Different balls interact with specific blocks:\n\n• Sticky Ball anchors to green Sticky Platforms (aim and shoot again!)\n• Metal Ball smashes through brown Weak Bricks\n• Flame Ball burns through wooden Flammable Bricks",
        images: [
            { frame: '1', x: -80, y: 100, scale: 1.2 }, { frame: '14', x: -80, y: 150, scale: 1.2 },
            { frame: '4', x: 0, y: 100, scale: 1.2 }, { frame: '12', x: 0, y: 150, scale: 1.2 },
            { frame: '6', x: 80, y: 100, scale: 1.2 }, { frame: '13', x: 80, y: 150, scale: 1.2 }
        ]
    }
];

export class Tutorial extends Scene {
    private currentPage: number = 0;
    private titleText: GameObjects.Text;
    private contentText: GameObjects.Text;
    private pageIndicator: GameObjects.Text;
    private imagesGroup: GameObjects.Group;
    
    constructor() {
        super('Tutorial');
    }

    create() {
        this.currentPage = 0;

        // Background
        this.add.image(GW / 2, GH / 2, 'background').setDisplaySize(GW, GH);

        // Dark overlay panel
        this.add.rectangle(GW / 2, GH / 2, GW - 100, GH - 150, 0x000000, 0.7)
            .setStrokeStyle(4, 0x00ffff);

        // UI Title
        this.add.text(GW / 2, 50, 'HOW TO PLAY', {
            fontFamily: 'Fredoka, Arial Black',
            fontSize: '40px',
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Page Content
        this.titleText = this.add.text(GW / 2, 130, '', {
            fontFamily: 'Fredoka, Arial Black',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        this.contentText = this.add.text(GW / 2, 230, '', {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: '#e0e0e0',
            align: 'center',
            wordWrap: { width: GW - 200 }
        }).setOrigin(0.5, 0);

        this.pageIndicator = this.add.text(GW / 2, GH - 120, '', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        this.imagesGroup = this.add.group();

        // Buttons
        const prevBtn = this.createButton(150, GH - 120, '◄ PREV', () => this.changePage(-1));
        const nextBtn = this.createButton(GW - 150, GH - 120, 'NEXT ►', () => this.changePage(1));
        const backBtn = this.createButton(GW / 2, GH - 40, 'BACK TO MENU', () => {
            playSound(this, 'click');
            this.scene.start('MainMenu');
        }, '#ff4444', '#ff8888');

        this.renderPage();
    }

    private createButton(x: number, y: number, text: string, onClick: () => void, color = '#ffffff', hoverColor = '#00ffff') {
        const btn = this.add.text(x, y, text, {
            fontFamily: 'Fredoka, Arial Black',
            fontSize: '24px',
            color: color,
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setColor(hoverColor).setScale(1.1));
        btn.on('pointerout', () => btn.setColor(color).setScale(1));
        btn.on('pointerdown', onClick);

        return btn;
    }

    private changePage(dir: number) {
        const newPage = this.currentPage + dir;
        if (newPage >= 0 && newPage < TUTORIAL_PAGES.length) {
            playSound(this, 'click');
            this.currentPage = newPage;
            this.renderPage();
        }
    }

    private renderPage() {
        const data = TUTORIAL_PAGES[this.currentPage];
        
        this.titleText.setText(data.title);
        this.contentText.setText(data.text);
        this.pageIndicator.setText(`Page ${this.currentPage + 1} of ${TUTORIAL_PAGES.length}`);

        // Clear old images
        this.imagesGroup.clear(true, true);

        // Render new images
        const centerY = 450;
        data.images.forEach(img => {
            // Note: star uses 'sprite' atlas, others use 'spritesheet'
            const texture = img.frame === '48' ? 'sprite' : 'spritesheet';
            const sprite = this.add.image(GW / 2 + img.x, centerY + img.y, texture, img.frame)
                .setScale(img.scale);
            this.imagesGroup.add(sprite);

            // Add simple bobbing animation
            this.tweens.add({
                targets: sprite,
                y: sprite.y - 10,
                duration: 1000 + Math.random() * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }
}
