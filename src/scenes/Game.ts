import { Scene } from 'phaser';
import { GW, GH } from '../main';
import { playSound } from './Preloader';
import * as Phaser from 'phaser';

interface LevelData {
    balls: number[]; // Spritesheet frames: 0=Normal, 1=Sticky, 2=Rubber, 3=AntiGravity, 4=Metal, 5=Nitro, 6=Flame, 7=Matroshka
    blocks: { x: number; y: number; type: number }[]; // 11=Standard, 12=Weak, 13=Flammable, 14=Ceil/Sticky
    spikes: { x: number; y: number }[];
    stars: { x: number; y: number }[];
    launcher: { x: number; y: number };
    portal: { x: number; y: number };
}

const LEVELS: Record<number, LevelData> = {
    1: {
        // Level 1: Launch Practice
        balls: [0, 0, 0],
        launcher: { x: 150, y: 580 },
        portal: { x: 850, y: 580 },
        stars: [
            { x: 400, y: 450 },
            { x: 500, y: 400 },
            { x: 600, y: 450 }
        ],
        blocks: [
            { x: 500, y: 600, type: 11 } // Standard brick in the middle
        ],
        spikes: []
    },
    2: {
        // Level 2: Bouncing High (Rubber Ball)
        balls: [2, 2, 2],
        launcher: { x: 150, y: 600 },
        portal: { x: 880, y: 600 },
        stars: [
            { x: 512, y: 180 },
            { x: 380, y: 350 },
            { x: 640, y: 350 }
        ],
        blocks: [
            // Tall dividing wall
            { x: 512, y: 650, type: 11 },
            { x: 512, y: 586, type: 11 },
            { x: 512, y: 522, type: 11 },
            { x: 512, y: 458, type: 11 },
            // Ceiling to bounce off
            { x: 380, y: 250, type: 11 },
            { x: 640, y: 250, type: 11 }
        ],
        spikes: [
            { x: 512, y: 394 } // Spikes on top of the divider wall
        ]
    },
    3: {
        // Level 3: Sticky Ceilings (Sticky Ball)
        balls: [1, 1, 1],
        launcher: { x: 120, y: 650 },
        portal: { x: 900, y: 220 },
        stars: [
            { x: 400, y: 200 },
            { x: 600, y: 200 },
            { x: 750, y: 200 }
        ],
        blocks: [
            // Ceil platform on the ceiling
            { x: 300, y: 300, type: 14 },
            { x: 500, y: 300, type: 14 },
            { x: 700, y: 300, type: 14 },
            // Barriers
            { x: 450, y: 550, type: 11 },
            { x: 450, y: 614, type: 11 },
            { x: 450, y: 678, type: 11 }
        ],
        spikes: [
            { x: 600, y: 678 }
        ]
    },
    4: {
        // Level 4: Gravity Flip (Anti Gravity Ball)
        balls: [3, 3, 3],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 180 },
        stars: [
            { x: 320, y: 150 },
            { x: 512, y: 150 },
            { x: 700, y: 150 }
        ],
        blocks: [
            // Ceiling separating floor and top
            { x: 350, y: 380, type: 11 },
            { x: 414, y: 380, type: 11 },
            { x: 478, y: 380, type: 11 },
            { x: 542, y: 380, type: 11 },
            { x: 606, y: 380, type: 11 },
            { x: 670, y: 380, type: 11 }
        ],
        spikes: [
            // Spikes on the floor
            { x: 400, y: 678 },
            { x: 464, y: 678 },
            { x: 528, y: 678 },
            { x: 592, y: 678 }
        ]
    },
    5: {
        // Level 5: Heavy Metal Crumble (Metal Ball)
        balls: [4, 4, 4],
        launcher: { x: 150, y: 600 },
        portal: { x: 880, y: 600 },
        stars: [
            { x: 512, y: 600 },
            { x: 512, y: 536 },
            { x: 512, y: 472 }
        ],
        blocks: [
            // Weak blocks wall blocking the portal
            { x: 512, y: 664, type: 12 },
            { x: 512, y: 600, type: 12 },
            { x: 512, y: 536, type: 12 },
            { x: 512, y: 472, type: 12 }
        ],
        spikes: []
    },
    6: {
        // Level 6: Flaming Fuel (Flame Ball)
        balls: [6, 6, 6],
        launcher: { x: 150, y: 600 },
        portal: { x: 880, y: 600 },
        stars: [
            { x: 480, y: 580 },
            { x: 544, y: 580 },
            { x: 608, y: 580 }
        ],
        blocks: [
            // Flammable wall
            { x: 544, y: 664, type: 13 },
            { x: 544, y: 600, type: 13 },
            { x: 544, y: 536, type: 13 }
        ],
        spikes: [
            { x: 350, y: 678 }
        ]
    },
    7: {
        // Level 7: Matryoshka Split (Matroshka Ball)
        balls: [7, 7, 7],
        launcher: { x: 150, y: 600 },
        portal: { x: 900, y: 600 },
        stars: [
            { x: 550, y: 350 },
            { x: 550, y: 470 },
            { x: 550, y: 590 }
        ],
        blocks: [
            // Wall with 3 separate small horizontal tunnels
            { x: 550, y: 250, type: 11 },
            { x: 550, y: 410, type: 11 },
            { x: 550, y: 530, type: 11 },
            { x: 550, y: 690, type: 11 }
        ],
        spikes: []
    },
    8: {
        // Level 8: Nitro Dash (Nitro Ball)
        balls: [5, 5, 5],
        launcher: { x: 120, y: 650 },
        portal: { x: 920, y: 350 },
        stars: [
            { x: 450, y: 450 },
            { x: 650, y: 380 },
            { x: 800, y: 350 }
        ],
        blocks: [
            // Obstacles requiring direct air speed
            { x: 550, y: 500, type: 11 },
            { x: 550, y: 564, type: 11 },
            { x: 550, y: 628, type: 11 }
        ],
        spikes: [
            // Large spike pit
            { x: 300, y: 678 },
            { x: 364, y: 678 },
            { x: 428, y: 678 },
            { x: 492, y: 678 },
            { x: 608, y: 678 },
            { x: 672, y: 678 },
            { x: 736, y: 678 },
            { x: 800, y: 678 }
        ]
    },
    9: {
        // Level 9: The Grand Finale (Strategy mix!)
        balls: [4, 6, 1, 0],
        launcher: { x: 120, y: 650 },
        portal: { x: 920, y: 650 },
        stars: [
            { x: 350, y: 480 },
            { x: 600, y: 420 },
            { x: 750, y: 220 }
        ],
        blocks: [
            // 1. Weak blocks wall
            { x: 350, y: 664, type: 12 },
            { x: 350, y: 600, type: 12 },
            // 2. Flammable wall
            { x: 600, y: 664, type: 13 },
            { x: 600, y: 600, type: 13 },
            // 3. Tall wall with Sticky platform on ceiling
            { x: 800, y: 664, type: 11 },
            { x: 800, y: 600, type: 11 },
            { x: 800, y: 536, type: 11 },
            { x: 800, y: 472, type: 11 },
            { x: 800, y: 300, type: 14 } // sticky roof
        ],
        spikes: [
            { x: 475, y: 678 },
            { x: 700, y: 678 }
        ]
    }
};

const BALL_INFO = [
    { name: 'Normal Ball', desc: 'Standard weight and bounce.', frame: '0' },
    { name: 'Sticky Ball', desc: 'Sticks to green ceilings. Aim & launch again!', frame: '1' },
    { name: 'Rubber Ball', desc: 'Extremely bouncy. High momentum.', frame: '2' },
    { name: 'Anti-Gravity', desc: 'Click mid-air to reverse gravity!', frame: '3' },
    { name: 'Metal Ball', desc: 'Heavy. Crashes through brown weak bricks.', frame: '4' },
    { name: 'Nitro Ball', desc: 'Click mid-air to dash towards cursor!', frame: '5' },
    { name: 'Flame Ball', desc: 'Hot! Instantly burns wooden bricks.', frame: '6' },
    { name: 'Matryoshka', desc: 'Click mid-air to split into 3 mini-balls!', frame: '7' }
];

export class Game extends Scene {
    private levelNum: number = 1;
    private levelData: LevelData;
    private score: number = 0;

    // Physics groups
    private blocksGroup: Phaser.Physics.Arcade.StaticGroup;
    private spikesGroup: Phaser.Physics.Arcade.StaticGroup;
    private starsGroup: Phaser.Physics.Arcade.StaticGroup;
    private portal: Phaser.Physics.Arcade.StaticImage;
    private launcherSprite: Phaser.GameObjects.Image;

    // Ball tracking
    private activeBalls: Phaser.Physics.Arcade.Sprite[] = [];
    private ballInventory: number[] = [];
    private starsCollected: number = 0;
    private starsEarned: boolean[] = [false, false, false];

    // Slingshot Aiming
    private aimGraphics: Phaser.GameObjects.Graphics;
    private isAiming: boolean = false;
    private aimStartPos: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    private aimCurrentPos: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    private currentLaunchPos: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    private activeBallIndex: number = 0; // Index of the ball frame being prepared
    private canLaunch: boolean = true;
    private isAnchored: boolean = false;
    private anchoredBall: Phaser.Physics.Arcade.Sprite | null = null;
    private ballStoppedTimer: number = 0;

    // Ability Flags
    private isGravityReversed: boolean = false;
    private hasDashed: boolean = false;
    private hasSplit: boolean = false;

    // UI
    private uiTextLevel: Phaser.GameObjects.Text;
    private uiTextDesc: Phaser.GameObjects.Text;
    private uiBallsIcons: Phaser.GameObjects.Image[] = [];
    private uiStars: Phaser.GameObjects.Image[] = [];
    private winOverlay: Phaser.GameObjects.Container;
    private loseOverlay: Phaser.GameObjects.Container;

    // Particles
    private trailEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

    private isTrainingMode: boolean = false;

    constructor() {
        super('Game');
    }

    init(data: { level?: number; mode?: string }) {
        this.isTrainingMode = data.mode === 'Training';
        this.levelNum = data.level || 1;
        
        if (this.isTrainingMode) {
            this.levelData = {
                balls: [0, 1, 2, 3, 4, 5, 6, 7], // All 8 balls!
                launcher: { x: 150, y: 580 },
                portal: { x: 850, y: 580 },
                stars: [
                    { x: 400, y: 300 },
                    { x: 512, y: 250 },
                    { x: 624, y: 300 }
                ],
                blocks: [
                    { x: 350, y: 450, type: 11 }, // Standard
                    { x: 450, y: 450, type: 12 }, // Weak
                    { x: 550, y: 450, type: 13 }, // Flammable
                    { x: 500, y: 200, type: 14 }  // Sticky platform
                ],
                spikes: [
                    { x: 500, y: 678 }
                ]
            };
        } else {
            this.levelData = LEVELS[this.levelNum] || LEVELS[1];
        }

        this.ballInventory = [...this.levelData.balls];
        this.starsCollected = 0;
        this.starsEarned = [false, false, false];
        this.score = 0;
        this.isAiming = false;
        this.canLaunch = true;
        this.isAnchored = false;
        this.anchoredBall = null;
        this.activeBalls = [];
        this.isGravityReversed = false;
        this.hasDashed = false;
        this.hasSplit = false;
    }

    create() {
        // Enable world bounds collisions
        this.physics.world.setBounds(0, 0, GW, GH);

        // Background
        this.add.image(512, 384, 'background');

        // Create groups
        this.blocksGroup = this.physics.add.staticGroup();
        this.spikesGroup = this.physics.add.staticGroup();
        this.starsGroup = this.physics.add.staticGroup();

        // Create Aim Graphics
        this.aimGraphics = this.add.graphics();

        // Load level assets
        this.loadLevelLayout();

        // Setup Colliders
        this.setupPhysicsColliders();

        // Setup UI
        this.createInGameUI();

        // Setup Input Listeners
        this.setupInputs();

        // Load first ball into launcher
        this.prepareNextBall();
    }

    private loadLevelLayout() {
        // Launcher Base
        const lp = this.levelData.launcher;
        this.launcherSprite = this.add.image(lp.x, lp.y, 'spritesheet', '15');
        this.currentLaunchPos.set(lp.x, lp.y - 20); // Position ball slightly above pad

        // Portal / Goal
        const gp = this.levelData.portal;
        this.portal = this.physics.add.staticImage(gp.x, gp.y, 'spritesheet', '8');
        this.portal.body.setCircle(20, 12, 12);
        
        // Add subtle rotation to the portal
        this.tweens.add({
            targets: this.portal,
            angle: 360,
            duration: 5000,
            repeat: -1
        });

        // Blocks
        this.levelData.blocks.forEach(b => {
            const block = this.blocksGroup.create(b.x, b.y, 'spritesheet', b.type.toString());
            block.setData('type', b.type);
            block.refreshBody();
        });

        // Spikes
        this.levelData.spikes.forEach(s => {
            const spike = this.spikesGroup.create(s.x, s.y, 'spritesheet', '9');
            spike.refreshBody();
        });

        // Stars
        this.levelData.stars.forEach((s, idx) => {
            const star = this.starsGroup.create(s.x, s.y, 'spritesheet', '10');
            star.setData('index', idx);
            star.refreshBody();
        });
    }

    private setupPhysicsColliders() {
        // Balls vs Blocks
        this.physics.add.collider(this.activeBalls, this.blocksGroup, (bObj, blockObj) => {
            const ball = bObj as Phaser.Physics.Arcade.Sprite;
            const block = blockObj as Phaser.Physics.Arcade.StaticSprite;
            const blockType = block.getData('type');
            const ballFrame = ball.frame.name;

            playSound(this, 'bounce');

            // 1. Metal Ball (frame '4') breaks Weak Blocks (type 12)
            if (ballFrame === '4' && blockType === 12) {
                this.spawnParticles(block.x, block.y, 0x8b7d7b, 15);
                block.destroy();
                playSound(this, 'break');
                this.score += 100;
            }

            // 2. Flame Ball (frame '6') burns Flammable Blocks (type 13)
            if (ballFrame === '6' && blockType === 13) {
                this.spawnParticles(block.x, block.y, 0xff4500, 25);
                block.destroy();
                playSound(this, 'burn');
                this.score += 100;
            }

            // 3. Sticky Ball (frame '1') anchors to Sticky platforms (type 14)
            if (ballFrame === '1' && blockType === 14 && !this.isAnchored) {
                // Anchor sticky ball
                this.anchorBall(ball);
            }
        });

        // Balls vs Spikes
        this.physics.add.overlap(this.activeBalls, this.spikesGroup, (bObj, spikeObj) => {
            const ball = bObj as Phaser.Physics.Arcade.Sprite;
            this.destroyBall(ball);
        });

        // Balls vs Stars
        this.physics.add.overlap(this.activeBalls, this.starsGroup, (bObj, starObj) => {
            const star = starObj as Phaser.Physics.Arcade.StaticSprite;
            const idx = star.getData('index');
            
            if (!this.starsEarned[idx]) {
                this.starsEarned[idx] = true;
                this.starsCollected++;
                playSound(this, 'collect');
                this.spawnParticles(star.x, star.y, 0xffd700, 15);
                
                // Update UI star icon
                this.uiStars[idx].setTint(0xffd700).setScale(1.2);
                this.tweens.add({
                    targets: this.uiStars[idx],
                    scale: 1.0,
                    duration: 200
                });
            }
            star.destroy();
        });

        // Balls vs Portal (Goal)
        this.physics.add.overlap(this.activeBalls, this.portal, (bObj) => {
            this.handleLevelWin();
        });
    }

    private anchorBall(ball: Phaser.Physics.Arcade.Sprite) {
        playSound(this, 'collect');
        this.isAnchored = true;
        this.anchoredBall = ball;
        
        // Stop movement & gravity
        ball.body.setAllowGravity(false);
        ball.setVelocity(0, 0);
        
        // Update launch pos to this ball's position
        this.currentLaunchPos.set(ball.x, ball.y);
        this.canLaunch = true;
        this.activeBallIndex = parseInt(ball.frame.name);

        // Highlight
        this.tweens.add({
            targets: ball,
            scale: 1.2,
            yoyo: true,
            duration: 150
        });
    }

    private destroyBall(ball: Phaser.Physics.Arcade.Sprite) {
        playSound(this, 'destroy');
        this.spawnParticles(ball.x, ball.y, 0xff0033, 20);
        
        const idx = this.activeBalls.indexOf(ball);
        if (idx > -1) {
            this.activeBalls.splice(idx, 1);
        }
        ball.destroy();

        // If no more active balls on screen, prepare next or lose
        if (this.activeBalls.length === 0) {
            this.isAnchored = false;
            this.anchoredBall = null;
            if (this.ballInventory.length > 0) {
                this.prepareNextBall();
            } else {
                if (this.isTrainingMode) {
                    // Refill in training mode
                    this.ballInventory = [0, 1, 2, 3, 4, 5, 6, 7];
                    this.prepareNextBall();
                } else {
                    // No balls left, wait a tiny bit to declare defeat
                    this.time.delayedCall(500, () => {
                        if (this.activeBalls.length === 0) {
                            this.handleLevelLose();
                        }
                    });
                }
            }
        }
    }

    private prepareNextBall() {
        if (this.ballInventory.length === 0) return;

        this.canLaunch = true;
        this.isAnchored = false;
        this.anchoredBall = null;

        // Retrieve first ball frame index
        this.activeBallIndex = this.ballInventory[0];
        this.currentLaunchPos.set(this.levelData.launcher.x, this.levelData.launcher.y - 20);

        // Update inventory UI
        this.updateInventoryUI();

        // Update Description text
        const info = BALL_INFO[this.activeBallIndex];
        this.uiTextDesc.setText(`Loaded: ${info.name}\n${info.desc}`);
    }

    private updateInventoryUI() {
        // Clear old icons
        this.uiBallsIcons.forEach(icon => icon.destroy());
        this.uiBallsIcons = [];

        // Render remaining queue
        const startX = 150;
        const startY = GH - 40;
        
        this.ballInventory.forEach((ballFrame, index) => {
            const x = startX + index * 45;
            const icon = this.add.image(x, startY, 'spritesheet', ballFrame.toString()).setScale(0.5);
            // Highlight current
            if (index === 0) {
                icon.setScale(0.7);
                icon.setTint(0xffffff);
                // Simple pulse
                this.tweens.add({
                    targets: icon,
                    alpha: 0.6,
                    yoyo: true,
                    repeat: -1,
                    duration: 600
                });
            } else {
                icon.setAlpha(0.6);
            }
            this.uiBallsIcons.push(icon);
        });
    }

    private createInGameUI() {
        // Top HUD Panel
        this.add.rectangle(GW / 2, 40, GW, 80, 0x000000, 0.4);

        // Level Title
        this.uiTextLevel = this.add.text(40, 25, this.isTrainingMode ? 'TRAINING SANDBOX' : `STAGE ${this.levelNum}`, {
            fontFamily: 'Arial Black',
            fontSize: '28px',
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 5
        });

        // Stars Indicators
        const starStartX = GW / 2 - 50;
        for (let i = 0; i < 3; i++) {
            const x = starStartX + i * 45;
            const star = this.add.image(x, 40, 'spritesheet', '10').setScale(0.5).setTint(0x333333);
            this.uiStars.push(star);
        }

        // Action controls
        const recallBtn = this.add.text(GW - 280, 25, 'RECALL ⤶', {
            fontFamily: 'Arial Black',
            fontSize: '18px',
            color: '#ffaa00',
            stroke: '#000000',
            strokeThickness: 4
        }).setInteractive({ useHandCursor: true });

        recallBtn.on('pointerover', () => recallBtn.setColor('#ffdd55'));
        recallBtn.on('pointerout', () => recallBtn.setColor('#ffaa00'));
        recallBtn.on('pointerdown', () => {
            playSound(this, 'click');
            // Destroy all active balls and load next
            const ballsCopy = [...this.activeBalls];
            ballsCopy.forEach(b => this.destroyBall(b));
        });

        const resetBtn = this.add.text(GW - 160, 25, 'RETRY ↺', {
            fontFamily: 'Arial Black',
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setInteractive({ useHandCursor: true });

        resetBtn.on('pointerover', () => resetBtn.setColor('#ffcc00'));
        resetBtn.on('pointerout', () => resetBtn.setColor('#ffffff'));
        resetBtn.on('pointerdown', () => {
            playSound(this, 'click');
            this.scene.restart();
        });

        const exitBtn = this.add.text(GW - 70, 25, '✖', {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            color: '#ff4444',
            stroke: '#000000',
            strokeThickness: 4
        }).setInteractive({ useHandCursor: true });

        exitBtn.on('pointerover', () => exitBtn.setColor('#ff8888'));
        exitBtn.on('pointerout', () => exitBtn.setColor('#ff4444'));
        exitBtn.on('pointerdown', () => {
            playSound(this, 'click');
            this.scene.start('Campaign');
        });

        // Bottom Dashboard Panel
        this.add.rectangle(GW / 2, GH - 40, GW, 80, 0x000000, 0.6);

        // Loaded Description text
        this.uiTextDesc = this.add.text(450, GH - 60, '', {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#a0ffaa',
            align: 'left'
        });

        this.add.text(40, GH - 52, 'INVENTORY:', {
            fontFamily: 'Arial Black',
            fontSize: '14px',
            color: '#aaaaaa'
        });

        // Interactive instruction tip
        this.add.text(GW - 280, GH - 50, 'DRAG BALL BACKWARDS TO AIM', {
            fontFamily: 'Arial Black',
            fontSize: '13px',
            color: '#888888'
        });

        // Win Overlay
        this.createWinOverlay();

        // Lose Overlay
        this.createLoseOverlay();
    }

    private setupInputs() {
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // Check if pointer is over any UI buttons or overlays
            if (this.winOverlay.visible || this.loseOverlay.visible || pointer.y < 80 || pointer.y > GH - 80) return;

            if (this.canLaunch) {
                // Start slingshot aiming if close to launch position
                const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.currentLaunchPos.x, this.currentLaunchPos.y);
                if (dist < 60) {
                    this.isAiming = true;
                    this.aimStartPos.copy(this.currentLaunchPos);
                    this.aimCurrentPos.copy(pointer);
                }
            } else {
                // Ball in-flight abilities!
                this.activeBalls.forEach(ball => {
                    const ballFrame = ball.frame.name;
                    
                    // 1. Anti Gravity (frame '3') - Toggles gravity Y acceleration
                    if (ballFrame === '3') {
                        playSound(this, 'bounce');
                        this.isGravityReversed = !this.isGravityReversed;
                        if (this.isGravityReversed) {
                            ball.body.setGravityY(-1200); // Inverse gravity pull
                            ball.setTint(0xee82ee);
                        } else {
                            ball.body.setGravityY(0); // Standard gravity pull
                            ball.clearTint();
                        }
                        this.spawnParticles(ball.x, ball.y, 0xee82ee, 10);
                    }

                    // 2. Nitro Dash (frame '5') - Dashes to mouse
                    if (ballFrame === '5' && !this.hasDashed) {
                        this.hasDashed = true;
                        playSound(this, 'launch');
                        
                        // Vector to click
                        const angle = Phaser.Math.Angle.Between(ball.x, ball.y, pointer.x, pointer.y);
                        const speed = 1000;
                        ball.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
                        ball.body.setAllowGravity(false);
                        
                        // Resume gravity after 0.5s
                        this.time.delayedCall(400, () => {
                            if (ball && ball.body) {
                                ball.body.setAllowGravity(true);
                            }
                        });
                        this.spawnParticles(ball.x, ball.y, 0xff4500, 20);
                    }

                    // 3. Matroshka Split (frame '7') - Splits into 3 balls
                    if (ballFrame === '7' && !this.hasSplit) {
                        this.hasSplit = true;
                        playSound(this, 'portal');

                        // Save current velocity and position
                        const px = ball.x;
                        const py = ball.y;
                        const vx = ball.body.velocity.x;
                        const vy = ball.body.velocity.y;

                        // Destroy original
                        this.destroyBall(ball);

                        // Spawn 3 smaller balls
                        const angles = [-0.2, 0, 0.2];
                        angles.forEach(offsetAngle => {
                            const mini = this.physics.add.sprite(px, py, 'spritesheet', '7');
                            mini.setScale(0.5);
                            mini.setCircle(10, 12, 12);
                            mini.setBounce(0.5);
                            mini.setCollideWorldBounds(true);
                            this.activeBalls.push(mini);

                            // Rotate velocity vector slightly
                            const baseAngle = Math.atan2(vy, vx);
                            const finalAngle = baseAngle + offsetAngle;
                            const currentSpeed = Math.sqrt(vx * vx + vy * vy) || 300;
                            mini.setVelocity(Math.cos(finalAngle) * currentSpeed, Math.sin(finalAngle) * currentSpeed);
                        });

                        // Re-register colliders for new balls
                        this.setupPhysicsColliders();
                    }
                });
            }
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isAiming) {
                this.aimCurrentPos.copy(pointer);
            }
        });

        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            if (this.isAiming) {
                this.isAiming = false;
                this.aimGraphics.clear();

                // Launch ball
                const dragVector = this.aimStartPos.clone().subtract(this.aimCurrentPos);
                const dragDist = dragVector.length();

                if (dragDist > 15) {
                    // Calculate launch velocity (clamped)
                    const maxDrag = 150;
                    const scale = Math.min(dragDist, maxDrag) / maxDrag;
                    const launchSpeed = 200 + scale * 750; // Max speed 950 px/s
                    
                    const angle = dragVector.angle();
                    const vx = Math.cos(angle) * launchSpeed;
                    const vy = Math.sin(angle) * launchSpeed;

                    this.launchBall(vx, vy);
                }
            }
        });
    }

    private launchBall(vx: number, vy: number) {
        playSound(this, 'launch');
        this.canLaunch = false;

        // Reset ability locks
        this.isGravityReversed = false;
        this.hasDashed = false;
        this.hasSplit = false;

        let ball: Phaser.Physics.Arcade.Sprite;

        if (this.isAnchored && this.anchoredBall) {
            // Reuse anchored sticky ball
            ball = this.anchoredBall;
            ball.body.setAllowGravity(true);
            this.isAnchored = false;
            this.anchoredBall = null;
        } else {
            // Consume inventory and spawn new ball
            this.ballInventory.shift();
            this.updateInventoryUI();
            
            ball = this.physics.add.sprite(this.currentLaunchPos.x, this.currentLaunchPos.y, 'spritesheet', this.activeBallIndex.toString());
            ball.setCircle(20);
            ball.setCollideWorldBounds(true);
            this.activeBalls.push(ball);

            // Re-apply physics colliders to encompass new balls
            this.setupPhysicsColliders();
        }

        // Set properties depending on ball type
        const frame = this.activeBallIndex;
        if (frame === 2) {
            // Rubber: high bounce
            ball.setBounce(0.9);
        } else if (frame === 4) {
            // Metal: low bounce, heavy
            ball.setBounce(0.1);
            ball.setMass(8);
        } else {
            // Standard bounce
            ball.setBounce(0.5);
        }

        // Fire it
        ball.setVelocity(vx, vy);

        // Start ball stopped timer
        this.ballStoppedTimer = 0;
    }

    update(time: number, delta: number) {
        // 1. Draw slingshot aiming lines
        if (this.isAiming) {
            this.drawAimTrajectory();
        }

        // 2. Monitor active ball speeds
        if (!this.canLaunch && this.activeBalls.length > 0) {
            let allStopped = true;
            this.activeBalls.forEach(ball => {
                const velocity = ball.body.velocity.length();
                // If any ball is moving, we don't count it as stopped
                if (velocity > 8) {
                    allStopped = false;
                }

                // If out of bounds or off the bottom of the screen, destroy
                if (ball.y > GH - 10) {
                    this.destroyBall(ball);
                }
            });

            if (allStopped && !this.isAnchored) {
                this.ballStoppedTimer += delta;
                // If stopped for more than 1.8 seconds, self-destruct active balls
                if (this.ballStoppedTimer > 1800) {
                    const ballsCopy = [...this.activeBalls];
                    ballsCopy.forEach(b => this.destroyBall(b));
                }
            } else {
                this.ballStoppedTimer = 0;
            }
        }
    }

    private drawAimTrajectory() {
        this.aimGraphics.clear();

        // Slingshot elastic band
        this.aimGraphics.lineStyle(4, 0x00ffff, 0.7);
        this.aimGraphics.lineBetween(this.aimStartPos.x, this.aimStartPos.y, this.aimCurrentPos.x, this.aimCurrentPos.y);

        // Aiming vector details
        const dragVector = this.aimStartPos.clone().subtract(this.aimCurrentPos);
        const dragDist = dragVector.length();
        if (dragDist < 15) return;

        const maxDrag = 150;
        const scale = Math.min(dragDist, maxDrag) / maxDrag;
        const launchSpeed = 200 + scale * 750;
        const angle = dragVector.angle();

        // Calculate initial velocities
        let vx = Math.cos(angle) * launchSpeed;
        let vy = Math.sin(angle) * launchSpeed;

        // Draw predicted trajectory points (gravity included)
        this.aimGraphics.fillStyle(0x00ffff, 0.8);
        
        let tx = this.aimStartPos.x;
        let ty = this.aimStartPos.y;
        
        const gravity = this.physics.world.gravity.y;
        const timeStep = 0.05; // 50ms intervals
        
        for (let step = 0; step < 18; step++) {
            tx += vx * timeStep;
            ty += vy * timeStep + 0.5 * gravity * timeStep * timeStep;
            vy += gravity * timeStep;

            const radius = Math.max(5 - step * 0.2, 1.5);
            this.aimGraphics.fillCircle(tx, ty, radius);
            
            // Break early if hitting boundaries
            if (tx < 0 || tx > GW || ty > GH - 10) break;
        }
    }

    private spawnParticles(x: number, y: number, color: number, count: number) {
        // Programmatic particle bursts using basic custom graphics/images or tinted squares
        const particles: Phaser.GameObjects.Rectangle[] = [];
        for (let i = 0; i < count; i++) {
            const size = Phaser.Math.Between(4, 8);
            const p = this.add.rectangle(x, y, size, size, color);
            this.physics.add.existing(p);
            
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
            const speed = Phaser.Math.Between(100, 250);
            (p.body as Phaser.Physics.Arcade.Body).setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
            (p.body as Phaser.Physics.Arcade.Body).setBounce(0.3);
            (p.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
            
            particles.push(p);

            // Fade out
            this.tweens.add({
                targets: p,
                alpha: 0,
                scale: 0.1,
                duration: 600,
                onComplete: () => p.destroy()
            });
        }
    }

    private handleLevelWin() {
        playSound(this, 'portal');

        // Clear active balls to stop gameplay loop
        this.activeBalls.forEach(b => b.destroy());
        this.activeBalls = [];

        // Save progress to local storage
        try {
            const data = localStorage.getItem('ballz_campaign_stars');
            let starsData: Record<number, number> = {};
            if (data) starsData = JSON.parse(data);

            const oldStars = starsData[this.levelNum] || 0;
            starsData[this.levelNum] = Math.max(oldStars, this.starsCollected);
            
            localStorage.setItem('ballz_campaign_stars', JSON.stringify(starsData));
        } catch (e) {
            console.error('Error saving stars score:', e);
        }

        // Show win screen overlay
        this.winOverlay.setVisible(true);

        // Animate overlay elements
        this.winOverlay.setAlpha(0);
        this.tweens.add({
            targets: this.winOverlay,
            alpha: 1,
            duration: 400
        });

        // Set star icons inside overlay
        const overlayStars = this.winOverlay.getData('stars') as Phaser.GameObjects.Image[];
        overlayStars.forEach((star, idx) => {
            star.setScale(0);
            if (idx < this.starsCollected) {
                this.time.delayedCall(500 + idx * 200, () => {
                    star.setTint(0xffd700).setScale(1.2);
                    playSound(this, 'collect');
                    this.tweens.add({
                        targets: star,
                        scale: 0.8,
                        duration: 150
                    });
                });
            } else {
                star.setTint(0x333333).setScale(0.8);
            }
        });
    }

    private handleLevelLose() {
        // Show lose overlay
        this.loseOverlay.setVisible(true);
        this.loseOverlay.setAlpha(0);
        this.tweens.add({
            targets: this.loseOverlay,
            alpha: 1,
            duration: 400
        });
    }

    private createWinOverlay() {
        this.winOverlay = this.add.container(0, 0).setVisible(false);

        // Dark background overlay
        const bg = this.add.rectangle(GW/2, GH/2, GW, GH, 0x000000, 0.8);
        this.winOverlay.add(bg);

        // Frame
        const frame = this.add.rectangle(GW/2, GH/2, 450, 320, 0x0a1c28)
            .setStrokeStyle(4, 0x00ffff);
        this.winOverlay.add(frame);

        // Title
        const title = this.add.text(GW/2, GH/2 - 90, 'STAGE CLEARED!', {
            fontFamily: 'Arial Black',
            fontSize: '36px',
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        this.winOverlay.add(title);

        // Stars array in container
        const overlayStars: Phaser.GameObjects.Image[] = [];
        const starSpacing = 60;
        const starStartX = GW/2 - starSpacing;

        for (let i = 0; i < 3; i++) {
            const x = starStartX + i * starSpacing;
            const star = this.add.image(x, GH/2 - 20, 'spritesheet', '10').setScale(0.8);
            this.winOverlay.add(star);
            overlayStars.push(star);
        }
        this.winOverlay.setData('stars', overlayStars);

        // Buttons
        const nextBtn = this.add.text(GW/2, GH/2 + 50, 'NEXT LEVEL', {
            fontFamily: 'Arial Black',
            fontSize: '22px',
            color: '#00ff66',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // If it's level 9 (last of page 1), next stage is not unlocked/available
        const isNextAvailable = LEVELS[this.levelNum + 1] !== undefined;
        if (!isNextAvailable) {
            nextBtn.setText('CAMPAIGN COMPLETED!').setColor('#ffaa00');
        }

        nextBtn.on('pointerover', () => nextBtn.setScale(1.1));
        nextBtn.on('pointerout', () => nextBtn.setScale(1.0));
        nextBtn.on('pointerdown', () => {
            playSound(this, 'click');
            if (isNextAvailable) {
                this.scene.start('Game', { level: this.levelNum + 1 });
            } else {
                this.scene.start('Campaign');
            }
        });
        this.winOverlay.add(nextBtn);

        const selectBtn = this.add.text(GW/2, GH/2 + 105, 'STAGE SELECT', {
            fontFamily: 'Arial Black',
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        selectBtn.on('pointerover', () => selectBtn.setColor('#ffcc00'));
        selectBtn.on('pointerout', () => selectBtn.setColor('#ffffff'));
        selectBtn.on('pointerdown', () => {
            playSound(this, 'click');
            this.scene.start('Campaign');
        });
        this.winOverlay.add(selectBtn);
    }

    private createLoseOverlay() {
        this.loseOverlay = this.add.container(0, 0).setVisible(false);

        // Dark bg
        const bg = this.add.rectangle(GW/2, GH/2, GW, GH, 0x000000, 0.8);
        this.loseOverlay.add(bg);

        // Frame
        const frame = this.add.rectangle(GW/2, GH/2, 400, 240, 0x1a0a0d)
            .setStrokeStyle(4, 0xff3344);
        this.loseOverlay.add(frame);

        // Title
        const title = this.add.text(GW/2, GH/2 - 50, 'STAGE FAILED', {
            fontFamily: 'Arial Black',
            fontSize: '34px',
            color: '#ff3344',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        this.loseOverlay.add(title);

        // Buttons
        const retryBtn = this.add.text(GW/2, GH/2 + 20, 'RETRY MISSION', {
            fontFamily: 'Arial Black',
            fontSize: '22px',
            color: '#ffaa00',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        retryBtn.on('pointerover', () => retryBtn.setScale(1.1));
        retryBtn.on('pointerout', () => retryBtn.setScale(1.0));
        retryBtn.on('pointerdown', () => {
            playSound(this, 'click');
            this.scene.restart();
        });
        this.loseOverlay.add(retryBtn);

        const selectBtn = this.add.text(GW/2, GH/2 + 75, 'STAGE SELECT', {
            fontFamily: 'Arial Black',
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        selectBtn.on('pointerover', () => selectBtn.setColor('#ffcc00'));
        selectBtn.on('pointerout', () => selectBtn.setColor('#ffffff'));
        selectBtn.on('pointerdown', () => {
            playSound(this, 'click');
            this.scene.start('Campaign');
        });
        this.loseOverlay.add(selectBtn);
    }
}
