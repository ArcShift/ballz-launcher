import { Scene } from 'phaser';
import { GW, GH } from '../main';
import { playSound } from './Preloader';

//global saved page
export var savedPage = 1;
export class CampaignSelection extends Scene {
    private currentPage: number = 1;
    private totalPages: number = 11;
    private starsData: Record<number, number> = {};
    
    // UI elements that need updating on page change
    private levelButtons: Phaser.GameObjects.Group;
    private pageText: Phaser.GameObjects.Text;
    private prevBtn: Phaser.GameObjects.Text;
    private nextBtn: Phaser.GameObjects.Text;

    constructor() {
        super('Campaign'); // Matches 'Campaign' scene key in MainMenu
    }

    init() {
        this.loadProgress();
    }

    create() {
        // Background
        this.add.image(512, 384, 'background');

        // Header Title
        this.add.text(GW / 2, 70, 'CAMPAIGN STAGES', {
            fontFamily: 'Arial Black',
            fontSize: '44px',
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Subtitle/Instructions
        this.add.text(GW / 2, 120, 'Select a mission to begin', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#a0a0ff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);

        // Group to manage level buttons
        this.levelButtons = this.add.group();

        // Create navigation UI
        this.createNavigation();

        // Render the active page
        this.renderPage();
    }

    private loadProgress() {
        try {
            const starsRaw = localStorage.getItem('ballz_campaign_stars');
            this.starsData = starsRaw ? JSON.parse(starsRaw) : {};

            savedPage = parseInt(localStorage.getItem('ballz_campaign_page') || '1', 10);
            this.currentPage = (savedPage >= 1 && savedPage <= this.totalPages) ? savedPage : 1;
        } catch (e) {
            console.error('Error loading progress:', e);
            this.starsData = {};
            this.currentPage = 1;
        }
    }

    private createNavigation() {
        // Back Button
        const backBtn = this.add.text(120, 60, '◀ MENU', {
            fontFamily: 'Arial Black',
            fontSize: '20px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => backBtn.setColor('#ffcc00'));
        backBtn.on('pointerout', () => backBtn.setColor('#ffffff'));
        backBtn.on('pointerdown', () => {
            playSound(this, 'click');
            this.scene.start('MainMenu');
        });

        // Reset Button
        const resetBtn = this.add.text(GW - 120, 60, 'RESET ↺', {
            fontFamily: 'Arial Black',
            fontSize: '16px',
            color: '#ff4444',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        resetBtn.on('pointerover', () => resetBtn.setColor('#ff8888'));
        resetBtn.on('pointerout', () => resetBtn.setColor('#ff4444'));
        resetBtn.on('pointerdown', () => {
            playSound(this, 'destroy');
            if (confirm('Are you sure you want to reset all campaign progress?')) {
                localStorage.removeItem('ballz_campaign_stars');
                localStorage.removeItem('ballz_campaign_page');
                this.starsData = {};
                this.currentPage = 1;
                this.renderPage();
            }
        });

        // Previous Page Button
        this.prevBtn = this.add.text(320, GH - 100, '◀ PREV', {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.prevBtn.on('pointerdown', () => {
            if (this.currentPage > 1) {
                playSound(this, 'click');
                this.currentPage--;
                this.renderPage();
            }
        });

        // Page Indicator Text
        this.pageText = this.add.text(GW / 2, GH - 100, `PAGE ${this.currentPage} / ${this.totalPages}`, {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Next Page Button
        this.nextBtn = this.add.text(GW - 320, GH - 100, 'NEXT ▶', {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.nextBtn.on('pointerdown', () => {
            if (this.currentPage < this.totalPages) {
                playSound(this, 'click');
                this.currentPage++;
                this.renderPage();
            }
        });

    }

    private renderPage() {
        // Clear previous buttons
        this.levelButtons.clear(true, true);

        // Update Page Indicator
        this.pageText.setText(`PAGE ${this.currentPage} / ${this.totalPages}`);

        // Update Navigation Button States
        this.prevBtn.setColor(this.currentPage === 1 ? '#555555' : '#ffffff');
        this.prevBtn.disableInteractive();
        if (this.currentPage > 1) this.prevBtn.setInteractive();

        this.nextBtn.setColor(this.currentPage === this.totalPages ? '#555555' : '#ffffff');
        this.nextBtn.disableInteractive();
        if (this.currentPage < this.totalPages) this.nextBtn.setInteractive();

        // Render the 3x3 level selection grid for every page
        const startLevel = (this.currentPage - 1) * 9 + 1;
        const cols = 3;
        const rows = 3;
        const startX = GW / 2 - 220;
        const startY = 200;
        const spacingX = 220;
        const spacingY = 140;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const levelIndex = startLevel + row * cols + col;
                const x = startX + col * spacingX;
                const y = startY + row * spacingY;

                this.createLevelButton(x, y, levelIndex);
            }
        }
    }

    private createLevelButton(x: number, y: number, levelNum: number) {
        const isUnlocked = levelNum === 1 || (this.starsData[levelNum - 1] !== undefined);

        const cardWidth = 180;
        const cardHeight = 110;

        const borderColor = isUnlocked ? 0x00ffff : 0x444444;
        const fillColor = isUnlocked ? 0x0a1c28 : 0x111111;

        const bgRect = this.add.rectangle(x, y, cardWidth, cardHeight, fillColor)
            .setStrokeStyle(3, borderColor)
            .setOrigin(0.5);
        this.levelButtons.add(bgRect);

        if (isUnlocked) {
            bgRect.setInteractive({ useHandCursor: true });
            
            const levelText = this.add.text(x, y - 20, `STAGE ${levelNum}`, {
                fontFamily: 'Arial Black',
                fontSize: '22px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
            this.levelButtons.add(levelText);

            const starsEarned = this.starsData[levelNum] || 0;
            const starSpacing = 28;
            const starStartX = x - starSpacing;

            for (let i = 0; i < 3; i++) {
                const starX = starStartX + i * starSpacing;
                const starY = y + 20;

                const star = this.add.image(starX, starY, 'sprite', '48').setScale(0.2);
                if (i >= starsEarned) {
                    star.setTint(0x333333);
                } else {
                    star.setTint(0xffd700);
                }
                this.levelButtons.add(star);
            }

            bgRect.on('pointerover', () => {
                bgRect.setStrokeStyle(4, 0xffcc00);
                bgRect.setFillStyle(0x102c3d);
                levelText.setColor('#ffcc00');
            });

            bgRect.on('pointerout', () => {
                bgRect.setStrokeStyle(3, 0x00ffff);
                bgRect.setFillStyle(0x0a1c28);
                levelText.setColor('#ffffff');
            });

            bgRect.on('pointerdown', () => {
                playSound(this, 'click');
                this.scene.start('Game', { level: levelNum, mode: 'Campaign' });
            });

        } else {
            const lockIcon = this.add.text(x, y - 10, '🔒', {
                fontSize: '28px'
            }).setOrigin(0.5);
            this.levelButtons.add(lockIcon);

            const lockedText = this.add.text(x, y + 20, 'LOCKED', {
                fontFamily: 'Arial Black',
                fontSize: '14px',
                color: '#555555'
            }).setOrigin(0.5);
            this.levelButtons.add(lockedText);
        }
    }
}
