import { Scene } from 'phaser';
import { GW, GH } from '../main';
import { LevelData } from '../entities/Level';
import { playSound } from './Preloader';
import { saveMap } from '../services/supabase';
import { getCrazyUser, happytime } from '../services/crazygames';

const GRID_SIZE = 64;
const PLAYABLE_COLS = 16; // x: 0 to 15 (1024px)
const PLAYABLE_ROWS = 10; // y: 0 to 9 (640px, starts at 80)
const PLAYABLE_Y_OFFSET = 80;
const ENABLE_COMMUNITY_MAPS = import.meta.env.VITE_ENABLE_COMMUNITY_MAPS === 'true';

const TOOLS = [
    { type: 11, name: 'Standard',image: 'spritesheet', frame: '11', scale: 1 },
    { type: 12, name: 'Weak',image: 'spritesheet', frame: '12', scale: 1 },
    { type: 13, name: 'Flammable',image: 'spritesheet', frame: '13', scale: 1 },
    { type: 14, name: 'Sticky',image: 'spritesheet', frame: '14', scale: 1 },
    { type: 9, name: 'Spike',image: 'spritesheet', frame: '9', scale: 1 },
    { type: 10, name: 'Star',image: 'sprite', frame: '48', scale: 1 },
    { type: 15, name: 'Launcher',image: 'spritesheet', frame: '15', scale: 1 },
    { type: 8, name: 'Portal',image: 'spritesheet', frame: '8', scale: 1 },
    { type: 0, name: 'Eraser',image: 'spritesheet', frame: '0', scale: 1 } // Custom handling
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

    // Sidebar state
    private sidebarIsRight: boolean = true;  // true = right side, false = left side
    private sidebarIsOpen: boolean = true;
    private toggleBtnText: Phaser.GameObjects.Text;
    private swapBtnText: Phaser.GameObjects.Text;
    private toggleBtnBg: Phaser.GameObjects.Rectangle;
    private swapBtnBg: Phaser.GameObjects.Rectangle;

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
        this.add.image(GW / 2, GH / 2, 'background').setDisplaySize(GW, GH);

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
            const sprite = this.add.sprite(s.x, s.y, 'sprite', '48');
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
    }

    private createTopBar() {
        this.add.rectangle(GW / 2, 40, GW, 80, 0x000000, 0.6).setDepth(0).setInteractive();

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
        const playBtn = this.add.text(GW - 420, 25, '▶ PLAY TEST', {
            fontFamily: 'Arial Black', fontSize: '18px', color: '#00ff66'
        }).setInteractive({ useHandCursor: true });
        
        playBtn.on('pointerover', () => playBtn.setColor('#aaffaa'));
        playBtn.on('pointerout', () => playBtn.setColor('#00ff66'));
        playBtn.on('pointerdown', () => {
            playSound(this, 'launch');
            this.saveSlot();
            this.scene.start('Game', { mode: 'Custom', levelData: this.levelData, customSlot: this.currentSlot });
        });

        if (ENABLE_COMMUNITY_MAPS) {
        const shareBtn = this.add.text(GW - 280, 25, '📤 SHARE', {
            fontFamily: 'Arial Black', fontSize: '18px', color: '#bb66ff'
        }).setInteractive({ useHandCursor: true });
        
        shareBtn.on('pointerover', () => shareBtn.setColor('#ddbbff'));
        shareBtn.on('pointerout', () => shareBtn.setColor('#bb66ff'));
        shareBtn.on('pointerdown', () => {
            playSound(this, 'click');
            this.saveSlot();
            this.showShareDialog();
        });
    }

        const clearBtn = this.add.text(GW - 140, 25, 'CLEAR', {
            fontFamily: 'Arial Black', fontSize: '18px', color: '#ffaa00'
        }).setInteractive({ useHandCursor: true });

        clearBtn.on('pointerover', () => clearBtn.setColor('#ffddaa'));
        clearBtn.on('pointerout', () => clearBtn.setColor('#ffaa00'));
        clearBtn.on('pointerdown', () => {
            playSound(this, 'click');
            this.showClearConfirmation();
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

    private async showShareDialog() {
        if (this.levelData.blocks.length === 0 && this.levelData.spikes.length === 0 && this.levelData.stars.length === 0) {
            alert('Cannot share an empty map! Please place some items first.');
            return;
        }

        if (this.levelData.balls.length === 0) {
            alert('Please add at least one ball to your inventory in the sidebar.');
            return;
        }

        if (document.getElementById('share-modal')) return;

        const cgUser = await getCrazyUser();
        const defaultAuthor = cgUser ? cgUser.username : 'Guest';
        const isGuest = !cgUser;

        const overlay = document.createElement('div');
        overlay.id = 'share-modal';
        overlay.className = 'game-overlay-container';

        overlay.innerHTML = `
            <div class="game-dialog">
                <div class="game-dialog-title">Share Stage</div>
                
                <label class="game-dialog-label" for="share-title-input">Stage Name</label>
                <input type="text" id="share-title-input" class="game-dialog-input" placeholder="Enter stage name..." maxlength="24" value="My Awesome Stage">
                
                <label class="game-dialog-label" for="share-author-input">Creator Name</label>
                <input type="text" id="share-author-input" class="game-dialog-input" placeholder="Enter creator name..." maxlength="16" value="${defaultAuthor}" ${!isGuest ? 'disabled' : ''}>
                ${!isGuest ? '<span style="font-size:10px; color:#00ff66; display:block; text-align:left; margin-top:4px;">Verified CrazyGames Account</span>' : ''}

                <div class="game-dialog-buttons">
                    <button id="share-btn-cancel" class="game-btn game-btn-cancel">Cancel</button>
                    <button id="share-btn-publish" class="game-btn game-btn-confirm">Publish</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const titleInput = document.getElementById('share-title-input') as HTMLInputElement;
        const authorInput = document.getElementById('share-author-input') as HTMLInputElement;
        const cancelBtn = document.getElementById('share-btn-cancel') as HTMLButtonElement;
        const publishBtn = document.getElementById('share-btn-publish') as HTMLButtonElement;

        titleInput.focus();

        const dismiss = () => {
            overlay.remove();
        };

        cancelBtn.addEventListener('click', () => {
            playSound(this, 'click');
            dismiss();
        });

        publishBtn.addEventListener('click', async () => {
            const title = titleInput.value.trim();
            const author = authorInput.value.trim();

            if (!title) {
                alert('Please enter a stage name.');
                return;
            }
            if (!author) {
                alert('Please enter a creator name.');
                return;
            }

            publishBtn.disabled = true;
            publishBtn.innerText = 'Publishing...';

            const { data, error } = await saveMap(title, author, cgUser ? cgUser.username : null, this.levelData);

            if (error) {
                alert('Failed to publish map: ' + error);
                publishBtn.disabled = false;
                publishBtn.innerText = 'Publish';
            } else {
                happytime();
                playSound(this, 'collect');
                alert('Stage published successfully to the Community list!');
                dismiss();
            }
        });
    }

    private showClearConfirmation() {
        const overlay = this.add.container(0, 0).setDepth(1000);
        
        // Darken background (blocks inputs below)
        const bg = this.add.rectangle(GW / 2, GH / 2, GW, GH, 0x000000, 0.8).setInteractive();
        overlay.add(bg);

        // Dialog box
        const dialog = this.add.rectangle(GW / 2, GH / 2, 400, 200, 0x222222).setStrokeStyle(4, 0x00ffff);
        overlay.add(dialog);

        // Text
        const text = this.add.text(GW / 2, GH / 2 - 40, 'Are you sure you want to\nCLEAR the map?', {
            fontFamily: 'Arial Black', fontSize: '20px', color: '#ffffff', align: 'center'
        }).setOrigin(0.5);
        overlay.add(text);

        // Yes Button
        const yesBtn = this.add.text(GW / 2 - 80, GH / 2 + 40, 'YES', {
            fontFamily: 'Arial Black', fontSize: '24px', color: '#ff4444'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        yesBtn.on('pointerover', () => yesBtn.setColor('#ff8888'));
        yesBtn.on('pointerout', () => yesBtn.setColor('#ff4444'));
        yesBtn.on('pointerdown', () => {
            playSound(this, 'destroy');
            this.levelData.blocks = [];
            this.levelData.spikes = [];
            this.levelData.stars = [];
            this.renderMap();
            this.saveSlot();
            overlay.destroy();
        });
        overlay.add(yesBtn);

        // No Button
        const noBtn = this.add.text(GW / 2 + 80, GH / 2 + 40, 'NO', {
            fontFamily: 'Arial Black', fontSize: '24px', color: '#00ff66'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        noBtn.on('pointerover', () => noBtn.setColor('#aaffaa'));
        noBtn.on('pointerout', () => noBtn.setColor('#00ff66'));
        noBtn.on('pointerdown', () => {
            playSound(this, 'click');
            overlay.destroy();
        });
        overlay.add(noBtn);
    }

    private sidebarContainer: Phaser.GameObjects.Container;

    // All sidebar children are positioned in LOCAL space (relative to container origin).
    // When on the RIGHT: container.x = GW - SIDEBAR_W  (= 832)
    // When on the LEFT:  container.x = 0
    private createSidebar() {
        const SIDEBAR_W = 192;
        const SIDEBAR_CENTER = SIDEBAR_W / 2; // 96 — horizontal center of sidebar

        // Start on the right side
        this.sidebarIsRight = true;
        this.sidebarIsOpen = true;
        this.sidebarContainer = this.add.container(GW - SIDEBAR_W, 80).setDepth(100);

        // ── Background panel (local: fills 0..SIDEBAR_W) ─────────────────────
        const bg = this.add.rectangle(SIDEBAR_CENTER, GH / 2, SIDEBAR_W, GH, 0x050a0f, 0.9).setInteractive();
        this.sidebarContainer.add(bg);

        // ── Toggle button (collapses/expands) ─────────────────────────────────
        // Sits on the LEFT edge of the sidebar panel (local x = -15)
        this.toggleBtnBg = this.add.rectangle(-15, GH / 2 - 50, 30, 70, 0x00ffff).setInteractive({ useHandCursor: true });
        this.toggleBtnText = this.add.text(-15, GH / 2 - 50, '▶', {
            fontFamily: 'Arial Black', fontSize: '16px', color: '#000000'
        }).setOrigin(0.5);
        this.sidebarContainer.add([this.toggleBtnBg, this.toggleBtnText]);

        // ── Swap button (moves sidebar left ↔ right) ──────────────────────────
        this.swapBtnBg = this.add.rectangle(-15, GH / 2 + 40, 30, 70, 0xffaa00).setInteractive({ useHandCursor: true });
        this.swapBtnText = this.add.text(-15, GH / 2 + 40, '⇄', {
            fontFamily: 'Arial Black', fontSize: '16px', color: '#000000'
        }).setOrigin(0.5);
        this.sidebarContainer.add([this.swapBtnBg, this.swapBtnText]);

        this.toggleBtnBg.on('pointerdown', () => {
            playSound(this, 'click');
            this.sidebarIsOpen = !this.sidebarIsOpen;
            this.applySidebarState(SIDEBAR_W);
        });

        this.swapBtnBg.on('pointerdown', () => {
            playSound(this, 'click');
            this.sidebarIsRight = !this.sidebarIsRight;
            // Flip the toggle/swap buttons to the correct edge
            const edgeX = this.sidebarIsRight ? -15 : SIDEBAR_W + 15;
            this.toggleBtnBg.setPosition(edgeX, GH / 2 - 50);
            this.toggleBtnText.setPosition(edgeX, GH / 2 - 50);
            this.swapBtnBg.setPosition(edgeX, GH / 2 + 40);
            this.swapBtnText.setPosition(edgeX, GH / 2 + 40);
            this.applySidebarState(SIDEBAR_W);
        });

        // ── Palette Title ─────────────────────────────────────────────────────
        this.sidebarContainer.add(this.add.text(SIDEBAR_CENTER, 20, 'PALETTE', {
            fontFamily: 'Arial Black', fontSize: '16px', color: '#ffffff'
        }).setOrigin(0.5));

        // ── 3×3 Tool Grid ─────────────────────────────────────────────────────
        const cols = 3;
        const startX = 32;
        const startY = 70;
        const spacing = 64;

        TOOLS.forEach((tool, idx) => {
            const cx = startX + (idx % cols) * spacing;
            const cy = startY + Math.floor(idx / cols) * spacing;

            const toolBg = this.add.rectangle(cx, cy, 50, 50, 0x112233).setInteractive({ useHandCursor: true });
            this.sidebarContainer.add(toolBg);

            if (tool.type === 0) {
                this.sidebarContainer.add(this.add.text(cx, cy, '✖', { fontFamily: 'Arial Black', fontSize: '24px', color: '#ff4444' }).setOrigin(0.5));
            } else {
                this.sidebarContainer.add(this.add.sprite(cx, cy, tool.image, tool.frame).setScale(0.6 * tool.scale));
            }

            toolBg.on('pointerdown', () => {
                playSound(this, 'click');
                this.selectedToolType = tool.type;
                this.updateToolSelection();
                if (tool.type === 0) {
                    this.hoverPreview.setTexture('spritesheet', '0').setTint(0xff0000);
                } else {
                    this.hoverPreview.setTexture(tool.image, tool.frame).clearTint();
                }
            });

            this.toolIcons.push(toolBg);
        });

        this.updateToolSelection();

        // ── Inventory Title ───────────────────────────────────────────────────
        this.sidebarContainer.add(this.add.text(SIDEBAR_CENTER, 380, 'INVENTORY', {
            fontFamily: 'Arial Black', fontSize: '16px', color: '#ffffff'
        }).setOrigin(0.5));

        // ── 2×4 Ball Grid ─────────────────────────────────────────────────────
        const bCols = 2;
        const bStartX = 48;
        const bStartY = 430;
        const bSpacingX = 96;
        const bSpacingY = 70;

        for (let i = 0; i < BALL_TYPES; i++) {
            const cx = bStartX + (i % bCols) * bSpacingX;
            const cy = bStartY + Math.floor(i / bCols) * bSpacingY;

            this.sidebarContainer.add(this.add.sprite(cx, cy - 15, 'spritesheet', i.toString()).setScale(0.5));

            const minus = this.add.text(cx - 25, cy + 15, '[-]', { fontFamily: 'Arial Black', fontSize: '14px', color: '#ff4444' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            const countText = this.add.text(cx, cy + 15, '0', { fontFamily: 'Arial Black', fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);
            const plus = this.add.text(cx + 25, cy + 15, '[+]', { fontFamily: 'Arial Black', fontSize: '14px', color: '#00ff66' }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            this.sidebarContainer.add([minus, countText, plus]);

            minus.on('pointerdown', () => { playSound(this, 'click'); this.adjustBallCount(i, -1); });
            plus.on('pointerdown', () => { playSound(this, 'click'); this.adjustBallCount(i, 1); });

            this.ballCountTexts.push(countText);
        }
    }

    /** Animate the sidebar container to its correct X position based on current state. */
    private applySidebarState(sidebarW: number) {
        const SIDEBAR_W = sidebarW;
        let targetX: number;

        if (this.sidebarIsOpen) {
            // Visible: anchor to left or right edge
            targetX = this.sidebarIsRight ? GW - SIDEBAR_W : 0;
            this.toggleBtnText.setText(this.sidebarIsRight ? '▶' : '◀');
        } else {
            // Hidden: slide off the respective edge
            targetX = this.sidebarIsRight ? GW : -SIDEBAR_W;
            this.toggleBtnText.setText(this.sidebarIsRight ? '◀' : '▶');
        }

        this.tweens.add({ targets: this.sidebarContainer, x: targetX, duration: 200 });
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
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
            if (currentlyOver.length > 0) {
                this.hoverPreview.setVisible(false);
                return;
            }
            if (pointer.x <= GW && pointer.y >= PLAYABLE_Y_OFFSET && pointer.y <= PLAYABLE_Y_OFFSET + PLAYABLE_ROWS * GRID_SIZE) {
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

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
            if (currentlyOver.length > 0) return;
            if (pointer.x <= GW && pointer.y >= PLAYABLE_Y_OFFSET && pointer.y <= PLAYABLE_Y_OFFSET + PLAYABLE_ROWS * GRID_SIZE) {
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
            const sprite = this.add.sprite(cx, cy, tool.image, tool.frame);
            this.gridObjects.set(key, { type: this.selectedToolType, sprite });
            // Only play sound on fresh click, not drag to avoid spam, or play a quieter version
            // playSound(this, 'click'); 
            this.saveSlot();
        }
    }
}
