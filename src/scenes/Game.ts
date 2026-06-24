import { Scene } from 'phaser';
import { GW, GH } from '../main';
import { playSound } from './Preloader';
import * as Phaser from 'phaser';
import { LEVELS } from '../entities/Level';
import { LevelData } from '../entities/Level';
//can't access property "drawImage", this.data is null
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
    private readyBallSprite: Phaser.GameObjects.Image | null = null; // Ball shown on launcher before launch

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
    private isCustomMode: boolean = false;
    private customSlotIndex: number = 1;

    constructor() {
        super('Game');
    }

    init(data: { level?: number; mode?: string; levelData?: LevelData; customSlot?: number }) {
        this.isTrainingMode = data.mode === 'Training';
        this.isCustomMode = data.mode === 'Custom';
        this.levelNum = data.level || 1;
        this.customSlotIndex = data.customSlot || 1;
        
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
        } else if (this.isCustomMode && data.levelData) {
            this.levelData = data.levelData;
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
        this.uiStars = [];
        this.uiBallsIcons = [];
        
        // Enable world bounds collisions
        this.physics.world.setBounds(0, 0, GW, GH);
        this.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body, up: boolean, down: boolean, left: boolean, right: boolean) => {
            let bounced = false;
            if (down && body.velocity.y < -10) bounced = true;
            if (up && body.velocity.y > 10) bounced = true;
            if (left && body.velocity.x > 10) bounced = true;
            if (right && body.velocity.x < -10) bounced = true;

            if (bounced) {
                playSound(this, 'bounce');
            }
        });

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
            const star = this.starsGroup.create(s.x, s.y, 'sprite', '48').setScale(0.5);
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

            let bounced = false;
            if (ball.body.touching.down && ball.body.velocity.y < -10) bounced = true;
            if (ball.body.touching.up && ball.body.velocity.y > 10) bounced = true;
            if (ball.body.touching.left && ball.body.velocity.x > 10) bounced = true;
            if (ball.body.touching.right && ball.body.velocity.x < -10) bounced = true;

            if (bounced) {
                playSound(this, 'bounce');
            }

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
                    scale: 0.5,
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

        // Show ball sprite sitting on the launcher
        if (this.readyBallSprite) this.readyBallSprite.destroy();
        this.readyBallSprite = this.add.image(
            this.currentLaunchPos.x,
            this.currentLaunchPos.y,
            'spritesheet',
            this.activeBallIndex.toString()
        );

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
        const titleText = this.isCustomMode ? `CUSTOM STAGE ${this.customSlotIndex}` : (this.isTrainingMode ? 'TRAINING SANDBOX' : `STAGE ${this.levelNum}`);
        this.uiTextLevel = this.add.text(40, 25, titleText, {
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
            const star = this.add.image(x, 40, 'sprite', '48').setScale(0.25).setTint(0x333333);
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
            if (this.isCustomMode) {
                this.scene.restart({ mode: 'Custom', levelData: this.levelData, customSlot: this.customSlotIndex });
            } else if (this.isTrainingMode) {
                this.scene.restart({ mode: 'Training' });
            } else {
                this.scene.restart({ level: this.levelNum });
            }
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
            if (this.isCustomMode) {
                this.scene.start('MapEditor', { slot: this.customSlotIndex });
            } else {
                this.scene.start('Campaign');
            }
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
                            (mini.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;
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

        // Destroy the visual preview ball — the real physics ball takes over
        if (this.readyBallSprite) {
            this.readyBallSprite.destroy();
            this.readyBallSprite = null;
        }

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
            (ball.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;
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

        // Move the ready ball sprite to follow the drag (slingshot pull-back)
        if (this.readyBallSprite) {
            const clampedDrag = Phaser.Math.Clamp(
                Phaser.Math.Distance.Between(this.aimStartPos.x, this.aimStartPos.y, this.aimCurrentPos.x, this.aimCurrentPos.y),
                0, 150
            );
            const dragAngle = Phaser.Math.Angle.Between(this.aimStartPos.x, this.aimStartPos.y, this.aimCurrentPos.x, this.aimCurrentPos.y);
            const pullFactor = clampedDrag / 150; // 0..1
            const maxPull = 40; // max visual pull-back in px
            this.readyBallSprite.setPosition(
                this.aimStartPos.x + Math.cos(dragAngle) * pullFactor * maxPull,
                this.aimStartPos.y + Math.sin(dragAngle) * pullFactor * maxPull
            );
        }

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

            // Remember which page this level belongs to, so Campaign Selection restores it
            const page = Math.ceil(this.levelNum / 9);
            localStorage.setItem('ballz_campaign_page', String(page));
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
            const star = this.add.image(x, GH/2 - 20, 'sprite', '48').setScale(0.4);
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
        
        if (this.isCustomMode) {
            nextBtn.setText('EDIT MAP').setColor('#00ffff');
        } else if (!isNextAvailable) {
            nextBtn.setText('CAMPAIGN COMPLETED!').setColor('#ffaa00');
        }

        nextBtn.on('pointerover', () => nextBtn.setScale(1.1));
        nextBtn.on('pointerout', () => nextBtn.setScale(1.0));
        nextBtn.on('pointerdown', () => {
            playSound(this, 'click');
            if (this.isCustomMode) {
                this.scene.start('MapEditor', { slot: this.customSlotIndex });
            } else if (isNextAvailable) {
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

        if (this.isCustomMode) {
            selectBtn.setText('BACK TO EDITOR');
        }

        selectBtn.on('pointerover', () => selectBtn.setColor('#ffcc00'));
        selectBtn.on('pointerout', () => selectBtn.setColor('#ffffff'));
        selectBtn.on('pointerdown', () => {
            playSound(this, 'click');
            if (this.isCustomMode) {
                this.scene.start('MapEditor', { slot: this.customSlotIndex });
            } else {
                this.scene.start('Campaign');
            }
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
            if (this.isCustomMode) {
                this.scene.restart({ mode: 'Custom', levelData: this.levelData, customSlot: this.customSlotIndex });
            } else if (this.isTrainingMode) {
                this.scene.restart({ mode: 'Training' });
            } else {
                this.scene.restart({ level: this.levelNum });
            }
        });
        this.loseOverlay.add(retryBtn);

        const selectBtn = this.add.text(GW/2, GH/2 + 75, 'STAGE SELECT', {
            fontFamily: 'Arial Black',
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        if (this.isCustomMode) {
            selectBtn.setText('BACK TO EDITOR');
        }

        selectBtn.on('pointerover', () => selectBtn.setColor('#ffcc00'));
        selectBtn.on('pointerout', () => selectBtn.setColor('#ffffff'));
        selectBtn.on('pointerdown', () => {
            playSound(this, 'click');
            if (this.isCustomMode) {
                this.scene.start('MapEditor', { slot: this.customSlotIndex });
            } else {
                this.scene.start('Campaign');
            }
        });
        this.loseOverlay.add(selectBtn);
    }
}
