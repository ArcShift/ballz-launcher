import { Scene } from 'phaser';
import { GW, GH } from '../main';
import { LevelData } from '../entities/Level';
import { playSound } from './Preloader';

const GRID_SIZE = 64;
const PLAYABLE_COLS = 13; // x: 0 to 12 (832px)
const PLAYABLE_ROWS = 10; // y: 0 to 9 (640px, starts at 80)
const PLAYABLE_Y_OFFSET = 80;

const TOOLS = [
    { type: 11, name: 'Standard', frame: '11' },
    { type: 12, name: 'Weak', frame: '12' },
    { type: 13, name: 'Flammable', frame: '13' },
    { type: 14, name: 'Sticky', frame: '14' },
    { type: 9, name: 'Spike', frame: '9' },
    { type: 10, name: 'Star', frame: '10' },
    { type: 15, name: 'Launcher', frame: '15' },
    { type: 8, name: 'Portal', frame: '8' },
    { type: 0, name: 'Eraser', frame: '0' } // Custom handling
];

const BALL_TYPES = 8;

export class MapEditor extends Scene {
    private currentSlot: number = 1;
    private levelData: LevelData;
    
    private selectedToolType: number = 11;
    
    // Grid State
    // Format: "x,y" -> { type: number, sprite: Phaser.GameObjects.Sprite }
    private gridObjects: Map<string, { type: number, sprite: Phaser.GameObjects.Sprite }> = new Map();
    private launcherSprite: Phaser.GameObjects.Sprite;
    private portalSprite: Phaser.GameObjects.Sprite;

    // UI
    private toolIcons: Phaser.GameObjects.Rectangle[] = [];
    private ballCountTexts: Phaser.GameObjects.Text[] = [];
    private slotTabs: Phaser.GameObjects.Rectangle[] = [];
    private slotTexts: Phaser.GameObjects.Text[] = [];

    // Interaction
    private hoverPreview: Phaser.GameObjects.Sprite;

    constructor() {
        super('MapEditor');
    }

    init(data: { slot?: number }) {
        this.currentSlot = data.slot || 1;
    }

    create() {
        this.toolIcons = [];
        this.ballCountTexts = [];
        this.slotTabs = [];
        this.slotTexts = [];
        this.gridObjects.clear();

        // Background
        this.add.image(512, 384, 'background');

        // Layout boundaries
        this.drawGrid();

        // Top Bar
        this.createTopBar();

        // Sidebar
        this.createSidebar();

        // Hover Preview
        this.hoverPreview = this.add.sprite(-100, -100, 'spritesheet', '11').setAlpha(0.5).setDepth(10);

        // Input setup
        this.setupInput();

        // Load map data
        this.loadSlot(this.currentSlot);
    }

    private getStorageKey(slot: number): string {
        return `ballz_custom_map_${slot}`;
    }

    private getDefaultMap(): LevelData {
        return {
            balls: [0, 0, 0],
            launcher: { x: Math.floor(PLAYABLE_COLS / 4) * GRID_SIZE + GRID_SIZE / 2, y: (PLAYABLE_ROWS - 1) * GRID_SIZE + PLAYABLE_Y_OFFSET + GRID_SIZE / 2 },
            portal: { x: Math.floor(PLAYABLE_COLS * 3 / 4) * GRID_SIZE + GRID_SIZE / 2, y: PLAYABLE_Y_OFFSET + GRID_SIZE / 2 },
            blocks: [],
            spikes: [],
            stars: []
        };
    }

    private loadSlot(slot: number) {
        this.currentSlot = slot;
        
        // Update Tabs UI
        this.slotTabs.forEach((tab, i) => {
            if (i + 1 === slot) {
                tab.setFillStyle(0x0a1c28).setStrokeStyle(3, 0x00ffff);
                this.slotTexts[i].setColor('#00ffff');
            } else {
                tab.setFillStyle(0x111111).setStrokeStyle(2, 0x444444);
                this.slotTexts[i].setColor('#aaaaaa');
            }
        });

        // Load from LocalStorage
        try {
            const raw = localStorage.getItem(this.getStorageKey(slot));
            if (raw) {
                this.levelData = JSON.parse(raw);
            } else {
                this.levelData = this.getDefaultMap();
            }
        } catch(e) {
            this.levelData = this.getDefaultMap();
        }

        this.renderMap();
        this.updateBallInventoryUI();
    }

    private saveSlot() {
        // Build level data from grid
        this.levelData.blocks = [];
        this.levelData.spikes = [];
        this.levelData.stars = [];

        this.gridObjects.forEach((obj, key) => {
            const [x, y] = key.split(',').map(Number);
            if (obj.type >= 11 && obj.type <= 14) {
                this.levelData.blocks.push({ x, y, type: obj.type });
            } else if (obj.type === 9) {
                this.levelData.spikes.push({ x, y });
            } else if (obj.type === 10) {
                this.levelData.stars.push({ x, y });
            }
        });

        // Launcher and Portal are updated dynamically on placement

        localStorage.setItem(this.getStorageKey(this.currentSlot), JSON.stringify(this.levelData));
    }

    private renderMap() {
        // Clear existing
        this.gridObjects.forEach(obj => obj.sprite.destroy());
        this.gridObjects.clear();

        if (this.launcherSprite) this.launcherSprite.destroy();
        if (this.portalSprite) this.portalSprite.destroy();

        // Render Blocks
        this.levelData.blocks.forEach(b => {
            const sprite = this.add.sprite(b.x, b.y, 'spritesheet', b.type.toString());
            this.gridObjects.set(`${b.x},${b.y}`, { type: b.type, sprite });
        });

        // Render Spikes
        this.levelData.spikes.forEach(s => {
            const sprite = this.add.sprite(s.x, s.y, 'spritesheet', '9');
            this.gridObjects.set(`${s.x},${s.y}`, { type: 9, sprite });
        });

        // Render Stars
        this.levelData.stars.forEach(s => {
            const sprite = this.add.sprite(s.x, s.y, 'spritesheet', '10');
            this.gridObjects.set(`${s.x},${s.y}`, { type: 10, sprite });
        });

        // Render Launcher
        this.launcherSprite = this.add.sprite(this.levelData.launcher.x, this.levelData.launcher.y, 'spritesheet', '15');
        
        // Render Portal
        this.portalSprite = this.add.sprite(this.levelData.portal.x, this.levelData.portal.y, 'spritesheet', '8');
    }

    private drawGrid() {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x444444, 0.5);

        // Vertical lines
        for (let i = 0; i <= PLAYABLE_COLS; i++) {
            graphics.moveTo(i * GRID_SIZE, PLAYABLE_Y_OFFSET);
            graphics.lineTo(i * GRID_SIZE, PLAYABLE_Y_OFFSET + PLAYABLE_ROWS * GRID_SIZE);
        }

        // Horizontal lines
        for (let i = 0; i <= PLAYABLE_ROWS; i++) {
            graphics.moveTo(0, PLAYABLE_Y_OFFSET + i * GRID_SIZE);
            graphics.lineTo(PLAYABLE_COLS * GRID_SIZE, PLAYABLE_Y_OFFSET + i * GRID_SIZE);
        }
        
        graphics.strokePath();

        // Sidebar Divider
        const div = this.add.graphics();
        div.lineStyle(2, 0x00ffff, 0.8);
        div.moveTo(832, 0);
        div.lineTo(832, GH);
        div.strokePath();
    }

    private createTopBar() {
        this.add.rectangle(GW / 2, 40, GW, 80, 0x000000, 0.6).setDepth(0);

        this.add.text(20, 25, 'MAP EDITOR', {
            fontFamily: 'Arial Black', fontSize: '24px', color: '#00ffff'
        });

        // Tabs
        for (let i = 1; i <= 3; i++) {
            const x = 250 + (i - 1) * 120;
            const tab = this.add.rectangle(x, 40, 100, 40, 0x111111).setStrokeStyle(2, 0x444444).setInteractive({ useHandCursor: true });
            const text = this.add.text(x, 40, `SLOT ${i}`, { fontFamily: 'Arial Black', fontSize: '14px', color: '#aaaaaa' }).setOrigin(0.5);
            
            tab.on('pointerdown', () => {
                playSound(this, 'click');
                this.loadSlot(i);
            });

            this.slotTabs.push(tab);
            this.slotTexts.push(text);
        }

        // Action Buttons
        const playBtn = this.add.text(GW - 300, 25, '▶ PLAY TEST', {
            fontFamily: 'Arial Black', fontSize: '18px', color: '#00ff66'
        }).setInteractive({ useHandCursor: true });
        
        playBtn.on('pointerover', () => playBtn.setColor('#aaffaa'));
        playBtn.on('pointerout', () => playBtn.setColor('#00ff66'));
        playBtn.on('pointerdown', () => {
            playSound(this, 'launch');
            this.saveSlot();
            this.scene.start('Game', { mode: 'Custom', levelData: this.levelData, customSlot: this.currentSlot });
        });

        const clearBtn = this.add.text(GW - 140, 25, 'CLEAR', {
            fontFamily: 'Arial Black', fontSize: '18px', color: '#ffaa00'
        }).setInteractive({ useHandCursor: true });

        clearBtn.on('pointerover', () => clearBtn.setColor('#ffddaa'));
        clearBtn.on('pointerout', () => clearBtn.setColor('#ffaa00'));
        clearBtn.on('pointerdown', () => {
            playSound(this, 'destroy');
            this.levelData.blocks = [];
            this.levelData.spikes = [];
            this.levelData.stars = [];
            this.renderMap();
            this.saveSlot();
        });

        const exitBtn = this.add.text(GW - 50, 25, '✖', {
            fontFamily: 'Arial Black', fontSize: '24px', color: '#ff4444'
        }).setInteractive({ useHandCursor: true });

        exitBtn.on('pointerover', () => exitBtn.setColor('#ff8888'));
        exitBtn.on('pointerout', () => exitBtn.setColor('#ff4444'));
        exitBtn.on('pointerdown', () => {
            playSound(this, 'click');
            this.saveSlot();
            this.scene.start('MainMenu');
        });
    }

    private createSidebar() {
        const sidebarX = 832;
        this.add.rectangle(sidebarX + 96, GH/2, 192, GH, 0x050a0f, 0.9);

        // Palette Title
        this.add.text(sidebarX + 96, 110, 'PALETTE', {
            fontFamily: 'Arial Black', fontSize: '16px', color: '#ffffff'
        }).setOrigin(0.5);

        // 3x3 Grid for tools
        const cols = 3;
        const startX = sidebarX + 32;
        const startY = 160;
        const spacing = 64;

        TOOLS.forEach((tool, idx) => {
            const cx = startX + (idx % cols) * spacing;
            const cy = startY + Math.floor(idx / cols) * spacing;

            const bg = this.add.rectangle(cx, cy, 50, 50, 0x112233).setInteractive({ useHandCursor: true });
            
            if (tool.type === 0) {
                // Eraser Icon
                this.add.text(cx, cy, '✖', { fontFamily: 'Arial Black', fontSize: '24px', color: '#ff4444' }).setOrigin(0.5);
            } else {
                this.add.sprite(cx, cy, 'spritesheet', tool.frame).setScale(0.6);
            }

            bg.on('pointerdown', () => {
                playSound(this, 'click');
                this.selectedToolType = tool.type;
                this.updateToolSelection();
                
                if (tool.type === 0) {
                    this.hoverPreview.setTexture('spritesheet', '0').setTint(0xff0000); // Red cross
                } else {
                    this.hoverPreview.setTexture('spritesheet', tool.frame).clearTint();
                }
            });

            this.toolIcons.push(bg);
        });

        this.updateToolSelection();

        // Inventory Title
        this.add.text(sidebarX + 96, 380, 'INVENTORY', {
            fontFamily: 'Arial Black', fontSize: '16px', color: '#ffffff'
        }).setOrigin(0.5);

        // 2x4 Grid for balls
        const bCols = 2;
        const bStartX = sidebarX + 48;
        const bStartY = 430;
        const bSpacingX = 96;
        const bSpacingY = 70;

        for (let i = 0; i < BALL_TYPES; i++) {
            const cx = bStartX + (i % bCols) * bSpacingX;
            const cy = bStartY + Math.floor(i / bCols) * bSpacingY;

            this.add.sprite(cx, cy - 15, 'spritesheet', i.toString()).setScale(0.5);

            // Minus btn
            const minus = this.add.text(cx - 25, cy + 15, '[-]', { fontFamily: 'Arial Black', fontSize: '14px', color: '#ff4444' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            // Count text
            const countText = this.add.text(cx, cy + 15, '0', { fontFamily: 'Arial Black', fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);
            // Plus btn
            const plus = this.add.text(cx + 25, cy + 15, '[+]', { fontFamily: 'Arial Black', fontSize: '14px', color: '#00ff66' }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            minus.on('pointerdown', () => {
                playSound(this, 'click');
                this.adjustBallCount(i, -1);
            });
            plus.on('pointerdown', () => {
                playSound(this, 'click');
                this.adjustBallCount(i, 1);
            });

            this.ballCountTexts.push(countText);
        }
    }

    private updateToolSelection() {
        TOOLS.forEach((tool, i) => {
            if (tool.type === this.selectedToolType) {
                this.toolIcons[i].setStrokeStyle(3, 0x00ffff);
            } else {
                this.toolIcons[i].setStrokeStyle(1, 0x444444);
            }
        });
    }

    private updateBallInventoryUI() {
        const counts = new Array(BALL_TYPES).fill(0);
        this.levelData.balls.forEach(b => {
            if (b >= 0 && b < BALL_TYPES) counts[b]++;
        });

        for (let i = 0; i < BALL_TYPES; i++) {
            this.ballCountTexts[i].setText(counts[i].toString());
        }
    }

    private adjustBallCount(ballType: number, delta: number) {
        if (delta > 0) {
            this.levelData.balls.push(ballType);
        } else if (delta < 0) {
            const idx = this.levelData.balls.indexOf(ballType);
            if (idx > -1) {
                this.levelData.balls.splice(idx, 1);
            }
        }
        this.updateBallInventoryUI();
        this.saveSlot();
    }

    private setupInput() {
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (pointer.x < 832 && pointer.y >= PLAYABLE_Y_OFFSET && pointer.y <= PLAYABLE_Y_OFFSET + PLAYABLE_ROWS * GRID_SIZE) {
                const col = Math.floor(pointer.x / GRID_SIZE);
                const row = Math.floor((pointer.y - PLAYABLE_Y_OFFSET) / GRID_SIZE);
                
                this.hoverPreview.setPosition(col * GRID_SIZE + GRID_SIZE / 2, row * GRID_SIZE + PLAYABLE_Y_OFFSET + GRID_SIZE / 2);
                this.hoverPreview.setVisible(true);

                if (pointer.isDown) {
                    this.handleGridClick(col, row);
                }
            } else {
                this.hoverPreview.setVisible(false);
            }
        });

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.x < 832 && pointer.y >= PLAYABLE_Y_OFFSET && pointer.y <= PLAYABLE_Y_OFFSET + PLAYABLE_ROWS * GRID_SIZE) {
                const col = Math.floor(pointer.x / GRID_SIZE);
                const row = Math.floor((pointer.y - PLAYABLE_Y_OFFSET) / GRID_SIZE);
                this.handleGridClick(col, row);
            }
        });
    }

    private handleGridClick(col: number, row: number) {
        const cx = col * GRID_SIZE + GRID_SIZE / 2;
        const cy = row * GRID_SIZE + PLAYABLE_Y_OFFSET + GRID_SIZE / 2;
        const key = `${cx},${cy}`;

        if (this.selectedToolType === 0) { // Eraser
            if (this.gridObjects.has(key)) {
                this.gridObjects.get(key)!.sprite.destroy();
                this.gridObjects.delete(key);
                playSound(this, 'break');
                this.saveSlot();
            }
            return;
        }

        // Handle unique placement items
        if (this.selectedToolType === 15) { // Launcher
            this.levelData.launcher.x = cx;
            this.levelData.launcher.y = cy;
            this.launcherSprite.setPosition(cx, cy);
            playSound(this, 'click');
            this.saveSlot();
            return;
        }

        if (this.selectedToolType === 8) { // Portal
            this.levelData.portal.x = cx;
            this.levelData.portal.y = cy;
            this.portalSprite.setPosition(cx, cy);
            playSound(this, 'portal');
            this.saveSlot();
            return;
        }

        if (this.selectedToolType === 10) {
            let starCount = 0;
            this.gridObjects.forEach(obj => {
                if (obj.type === 10) starCount++;
            });
            // Don't allow placing more than 3 stars
            if (starCount >= 3 && (!this.gridObjects.has(key) || this.gridObjects.get(key)!.type !== 10)) {
                return;
            }
        }

        // Handle Blocks/Spikes/Stars
        // Don't place if there's already an item of the SAME type
        if (this.gridObjects.has(key)) {
            if (this.gridObjects.get(key)!.type === this.selectedToolType) return;
            // Otherwise remove old item
            this.gridObjects.get(key)!.sprite.destroy();
        }

        const tool = TOOLS.find(t => t.type === this.selectedToolType);
        if (tool) {
            const sprite = this.add.sprite(cx, cy, 'spritesheet', tool.frame);
            this.gridObjects.set(key, { type: this.selectedToolType, sprite });
            // Only play sound on fresh click, not drag to avoid spam, or play a quieter version
            // playSound(this, 'click'); 
            this.saveSlot();
        }
    }
}
