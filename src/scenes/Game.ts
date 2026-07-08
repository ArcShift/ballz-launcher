import { Scene } from 'phaser';
import { GW, GH } from '../main';
import { playSound } from './Preloader';
import * as Phaser from 'phaser';
import { LEVELS } from '../entities/Level';
import { LevelData } from '../entities/Level';
import { submitRating, submitComment, getMapComments, getPlayerRatingForMap } from '../services/supabase';
import { getCrazyUser } from '../services/crazygames';
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
    private portal: Phaser.Physics.Arcade.Image;
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
    private pauseMenu: Phaser.GameObjects.Container;

    // Particles
    private trailEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

    private isTrainingMode: boolean = false;
    private isCustomMode: boolean = false;
    private customSlotIndex: number = 1;
    private isCommunityMode: boolean = false;
    private communityMapId: string | number = '';
    private communityMapTitle: string = '';
    private communityMapAuthor: string = '';
    
    private isSeedMode: boolean = false;
    private seedNum: number = 1;
    private seedStr: string = '';

    constructor() {
        super('Game');
    }

    init(data: { level?: number; mode?: string; levelData?: LevelData; customSlot?: number; communityMapId?: string | number; communityMapTitle?: string; communityMapAuthor?: string; seed?: number; seedStr?: string }) {
        this.isTrainingMode = data.mode === 'Training';
        this.isCustomMode = data.mode === 'Custom';
        this.isCommunityMode = data.mode === 'Community';
        this.isSeedMode = data.mode === 'Seed';
        this.seedNum = data.seed || 1;
        this.seedStr = data.seedStr || '';
        this.levelNum = data.level || 1;
        this.customSlotIndex = data.customSlot || 1;
        this.communityMapId = data.communityMapId || '';
        this.communityMapTitle = data.communityMapTitle || '';
        this.communityMapAuthor = data.communityMapAuthor || '';
        
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
        } else if (this.isCommunityMode && data.levelData) {
            this.levelData = typeof data.levelData === 'string' ? JSON.parse(data.levelData) : data.levelData;
        } else if (this.isSeedMode && data.levelData) {
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
        // this.add.image(GW/2, GH/2, 'darkSpace').setDisplaySize(GW, GH);
        this.add.image(GW/2, GH/2, 'background').setDisplaySize(GW, GH);

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
        this.portal = this.physics.add.image(gp.x, gp.y, 'spritesheet', '8');
        this.portal.setCircle(20, 12, 12);
        (this.portal.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        (this.portal.body as Phaser.Physics.Arcade.Body).setImmovable(true);
        
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
            const star = this.starsGroup.create(s.x, s.y, 'sprite', '48');
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
        const titleText = this.isCommunityMode 
            ? `${this.communityMapTitle.toUpperCase()} by ${this.communityMapAuthor}` 
            : (this.isCustomMode ? `CUSTOM STAGE ${this.customSlotIndex}` : (this.isTrainingMode ? 'TRAINING SANDBOX' : (this.isSeedMode ? this.seedStr : `STAGE ${this.levelNum}`)));
        this.uiTextLevel = this.add.text(40, 25, titleText, {
            fontFamily: 'Arial Black',
            fontSize: this.isCommunityMode ? '20px' : '28px', // Adjust font size for longer titles
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 5
        });

        // Stars Indicators
        const starStartX = GW / 2 - 50;
        for (let i = 0; i < 3; i++) {
            const x = starStartX + i * 45;
            const star = this.add.image(x, 40, 'sprite', '48').setScale(0.5).setTint(0x333333);
            this.uiStars.push(star);
        }

        // ── Hamburger menu button (top-right) ──────────────────────────────
        const menuBtn = this.add.text(GW - 50, 25, '☰', {
            fontFamily: 'Arial Black',
            fontSize: '28px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setInteractive({ useHandCursor: true });

        menuBtn.on('pointerover', () => menuBtn.setColor('#00ffff'));
        menuBtn.on('pointerout', () => menuBtn.setColor('#ffffff'));
        menuBtn.on('pointerdown', () => {
            playSound(this, 'click');
            this.togglePauseMenu(true);
        });

        // ── Pause popup menu ───────────────────────────────────────────────
        this.createPauseMenu();

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
                            mini.setCircle(20, 12, 12);
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
            ball.setCircle(20, 12, 12);
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

                // Reduce friction when ball is touching the ground
                if (ball.body.blocked.down || ball.body.touching.down) {
                    ball.body.velocity.x *= 0.95;
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
        try {
            const page = Math.ceil(this.levelNum / 9);
            localStorage.setItem('ballz_campaign_page', String(page));
        } catch (e) {
            console.error('Error saving campaign page:', e);
        }

        // Show lose overlay
        this.loseOverlay.setVisible(true);
        this.loseOverlay.setAlpha(0);
        this.tweens.add({
            targets: this.loseOverlay,
            alpha: 1,
            duration: 400
        });
    }

    // ── Pause / menu popup ─────────────────────────────────────────────────
    private createPauseMenu() {
        const pw = 340;
        const ph = 280;
        const cx = GW / 2;
        const cy = GH / 2;

        this.pauseMenu = this.add.container(0, 0).setVisible(false).setDepth(100);

        // Dim full screen
        const dimBg = this.add.rectangle(cx, cy, GW, GH, 0x000000, 0.65)
            .setInteractive(); // blocks clicks through
        this.pauseMenu.add(dimBg);

        // Panel
        const panel = this.add.rectangle(cx, cy, pw, ph, 0x0a1c28)
            .setStrokeStyle(3, 0x00ffff);
        this.pauseMenu.add(panel);

        // Title
        const title = this.add.text(cx, cy - 100, 'MENU', {
            fontFamily: 'Arial Black',
            fontSize: '26px',
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);
        this.pauseMenu.add(title);

        // Helper to build a menu row button
        const makeBtn = (label: string, yOff: number, color: string, hoverColor: string, action: () => void) => {
            const rowBg = this.add.rectangle(cx, cy + yOff, pw - 40, 46, 0x112233, 0.9)
                .setStrokeStyle(1, 0x224455)
                .setInteractive({ useHandCursor: true });
            const rowText = this.add.text(cx, cy + yOff, label, {
                fontFamily: 'Arial Black',
                fontSize: '20px',
                color: color,
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);

            rowBg.on('pointerover', () => { rowBg.setFillStyle(0x1a3a55); rowText.setColor(hoverColor); });
            rowBg.on('pointerout',  () => { rowBg.setFillStyle(0x112233); rowText.setColor(color); });
            rowBg.on('pointerdown', () => { playSound(this, 'click'); action(); });

            this.pauseMenu.add(rowBg);
            this.pauseMenu.add(rowText);
        };

        // RECALL
        makeBtn('⤶  RECALL BALL', -45, '#ffaa00', '#ffdd55', () => {
            this.togglePauseMenu(false);
            const ballsCopy = [...this.activeBalls];
            ballsCopy.forEach(b => this.destroyBall(b));
        });

        // RETRY
        makeBtn('↺  RETRY STAGE', 15, '#ffffff', '#ffcc00', () => {
            this.togglePauseMenu(false);
            if (this.isCommunityMode) {
                this.scene.restart({
                    mode: 'Community',
                    levelData: this.levelData,
                    communityMapId: this.communityMapId,
                    communityMapTitle: this.communityMapTitle,
                    communityMapAuthor: this.communityMapAuthor
                });
            } else if (this.isCustomMode) {
                this.scene.restart({ mode: 'Custom', levelData: this.levelData, customSlot: this.customSlotIndex });
            } else if (this.isTrainingMode) {
                this.scene.restart({ mode: 'Training' });
            } else if (this.isSeedMode) {
                this.scene.restart({ mode: 'Seed', seed: this.seedNum, seedStr: this.seedStr, levelData: this.levelData });
            } else {
                this.scene.restart({ level: this.levelNum });
            }
        });

        // CLOSE / EXIT
        makeBtn('✖  CLOSE STAGE', 75, '#ff4444', '#ff8888', () => {
            this.togglePauseMenu(false);
            if (this.isCommunityMode) {
                this.scene.start('CommunityMaps');
            } else if (this.isCustomMode) {
                this.scene.start('MapEditor', { slot: this.customSlotIndex });
            } else if (this.isSeedMode) {
                this.scene.start('SeedPreparation');
            } else {
                this.scene.start('Campaign');
            }
        });

        // Dismiss X
        const closeX = this.add.text(cx + pw / 2 - 30, cy - ph / 2 + 40, '✕', {
            fontFamily: 'Arial Black',
            fontSize: '18px',
            color: '#888888',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeX.on('pointerover', () => closeX.setColor('#ffffff'));
        closeX.on('pointerout',  () => closeX.setColor('#888888'));
        closeX.on('pointerdown', () => { playSound(this, 'click'); this.togglePauseMenu(false); });
        this.pauseMenu.add(closeX);
    }

    private togglePauseMenu(show: boolean) {
        this.pauseMenu.setVisible(show);
        if (show) {
            this.pauseMenu.setAlpha(0);
            this.tweens.add({ targets: this.pauseMenu, alpha: 1, duration: 180 });
        }
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
            const star = this.add.image(x, GH/2 - 20, 'sprite', '48').setScale(0.8);
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
        
        if (this.isCommunityMode) {
            nextBtn.setText('BACK TO LIST').setColor('#00ff66');
        } else if (this.isCustomMode) {
            nextBtn.setText('EDIT MAP').setColor('#00ffff');
        } else if (this.isSeedMode) {
            nextBtn.setText('NEW SEED').setColor('#00ff66');
        } else if (!isNextAvailable) {
            nextBtn.setText('CAMPAIGN COMPLETED!').setColor('#ffaa00');
        }

        nextBtn.on('pointerover', () => nextBtn.setScale(1.1));
        nextBtn.on('pointerout', () => nextBtn.setScale(1.0));
        nextBtn.on('pointerdown', () => {
            playSound(this, 'click');
            if (this.isCommunityMode) {
                this.scene.start('CommunityMaps');
            } else if (this.isCustomMode) {
                this.scene.start('MapEditor', { slot: this.customSlotIndex });
            } else if (this.isSeedMode) {
                this.scene.start('SeedPreparation');
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

        if (this.isCommunityMode) {
            selectBtn.setText('⭐ RATE & COMMENT').setColor('#ffaa00');
        } else if (this.isCustomMode) {
            selectBtn.setText('BACK TO EDITOR');
        } else if (this.isSeedMode) {
            selectBtn.setText('BACK TO SEED PREP');
        }

        selectBtn.on('pointerover', () => selectBtn.setColor('#ffcc00'));
        selectBtn.on('pointerout', () => selectBtn.setColor(this.isCommunityMode ? '#ffaa00' : '#ffffff'));
        selectBtn.on('pointerdown', () => {
            playSound(this, 'click');
            if (this.isCommunityMode) {
                this.showRateCommentDialog();
            } else if (this.isCustomMode) {
                this.scene.start('MapEditor', { slot: this.customSlotIndex });
            } else if (this.isSeedMode) {
                this.scene.start('SeedPreparation');
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
            if (this.isCommunityMode) {
                this.scene.restart({
                    mode: 'Community',
                    levelData: this.levelData,
                    communityMapId: this.communityMapId,
                    communityMapTitle: this.communityMapTitle,
                    communityMapAuthor: this.communityMapAuthor
                });
            } else if (this.isCustomMode) {
                this.scene.restart({ mode: 'Custom', levelData: this.levelData, customSlot: this.customSlotIndex });
            } else if (this.isTrainingMode) {
                this.scene.restart({ mode: 'Training' });
            } else if (this.isSeedMode) {
                this.scene.restart({ mode: 'Seed', seed: this.seedNum, seedStr: this.seedStr, levelData: this.levelData });
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

        if (this.isCommunityMode) {
            selectBtn.setText('BACK TO LIST');
        } else if (this.isCustomMode) {
            selectBtn.setText('BACK TO EDITOR');
        } else if (this.isSeedMode) {
            selectBtn.setText('BACK TO SEED PREP');
        }

        selectBtn.on('pointerover', () => selectBtn.setColor('#ffcc00'));
        selectBtn.on('pointerout', () => selectBtn.setColor('#ffffff'));
        selectBtn.on('pointerdown', () => {
            playSound(this, 'click');
            if (this.isCommunityMode) {
                this.scene.start('CommunityMaps');
            } else if (this.isCustomMode) {
                this.scene.start('MapEditor', { slot: this.customSlotIndex });
            } else if (this.isSeedMode) {
                this.scene.start('SeedPreparation');
            } else {
                this.scene.start('Campaign');
            }
        });
        this.loseOverlay.add(selectBtn);
    }

    private async showRateCommentDialog() {
        if (document.getElementById('rate-comment-modal')) return;

        const cgUser = await getCrazyUser();
        const defaultAuthor = cgUser ? cgUser.username : 'Guest';
        const isGuest = !cgUser;

        // Fetch existing comments and user rating
        const { data: comments } = await getMapComments(this.communityMapId);
        
        let userRating = 0;
        if (cgUser) {
            userRating = await getPlayerRatingForMap(this.communityMapId, cgUser.username) || 0;
        }

        const overlay = document.createElement('div');
        overlay.id = 'rate-comment-modal';
        overlay.className = 'game-overlay-container';

        overlay.innerHTML = `
            <div class="game-dialog" style="width: 500px; max-height: 90vh; display: flex; flex-direction: column;">
                <div class="game-dialog-title" style="margin-bottom:10px;">Rate & Comment</div>
                <div style="font-size: 14px; color: #aaaaaa; margin-bottom: 20px;">
                    Stage: <span style="color:#00ffff; font-weight:bold;">${this.communityMapTitle}</span> by ${this.communityMapAuthor}
                </div>

                <!-- Rating Stars -->
                <div style="margin-bottom: 15px;">
                    <span style="font-size: 14px; color: #aaaaaa; display: block; margin-bottom: 5px;">Your Rating:</span>
                    <div id="stars-container" style="font-size: 32px; display: inline-flex; gap: 8px; justify-content: center; cursor: pointer; user-select: none;">
                        <span class="star-node" data-value="1" style="color: #444; transition: transform 0.1s;">★</span>
                        <span class="star-node" data-value="2" style="color: #444; transition: transform 0.1s;">★</span>
                        <span class="star-node" data-value="3" style="color: #444; transition: transform 0.1s;">★</span>
                        <span class="star-node" data-value="4" style="color: #444; transition: transform 0.1s;">★</span>
                        <span class="star-node" data-value="5" style="color: #444; transition: transform 0.1s;">★</span>
                    </div>
                </div>

                <!-- Add Comment -->
                <div style="text-align: left; margin-bottom: 15px;">
                    <label class="game-dialog-label" for="comment-author" style="margin-top: 0;">Your Name</label>
                    <input type="text" id="comment-author" class="game-dialog-input" placeholder="Your name..." maxlength="16" value="${defaultAuthor}" ${!isGuest ? 'disabled' : ''} style="margin-bottom: 8px; padding: 8px 12px; font-size:14px;">
                    
                    <label class="game-dialog-label" for="comment-textarea" style="margin-top: 0;">Add a comment</label>
                    <textarea id="comment-textarea" class="game-dialog-input" placeholder="Write a comment... (max 120 chars)" maxlength="120" style="resize: none; height: 60px; font-family: sans-serif; font-size: 14px; padding: 8px 12px;"></textarea>
                </div>

                <!-- Comments List -->
                <div style="text-align: left; flex: 1; min-height: 120px; overflow-y: auto; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 10px; border: 1px solid #224455; margin-bottom: 20px; font-family: Arial, sans-serif;">
                    <div style="font-weight: bold; font-size: 12px; color: #00ffff; border-bottom: 1px solid #224455; padding-bottom: 5px; margin-bottom: 8px; text-transform: uppercase;">
                        Comments (${comments?.length || 0})
                    </div>
                    <div id="comments-list-box" style="display: flex; flex-direction: column; gap: 8px; max-height: 140px;">
                        ${comments && comments.length > 0 ? comments.map(c => `
                            <div style="border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 6px;">
                                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                                    <span style="color: #00ff66; font-weight: bold;">${c.author}</span>
                                    <span style="color: #777;">${new Date(c.created_at).toLocaleDateString()}</span>
                                </div>
                                <div style="font-size: 13px; color: #ddd; margin-top: 2px; word-break: break-word;">${c.comment}</div>
                            </div>
                        `).join('') : '<div style="color:#777; font-size:12px; text-align:center; padding-top:20px;">No comments yet.</div>'}
                    </div>
                </div>

                <!-- Footer Buttons -->
                <div class="game-dialog-buttons" style="margin-top: 0;">
                    <button id="rate-cancel" class="game-btn game-btn-cancel">Close</button>
                    <button id="rate-submit" class="game-btn game-btn-confirm">Submit</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const stars = Array.from(overlay.querySelectorAll('.star-node')) as HTMLElement[];
        const authorInput = document.getElementById('comment-author') as HTMLInputElement;
        const commentTextarea = document.getElementById('comment-textarea') as HTMLTextAreaElement;
        const cancelBtn = document.getElementById('rate-cancel') as HTMLButtonElement;
        const submitBtn = document.getElementById('rate-submit') as HTMLButtonElement;

        let selectedRating = userRating;

        const updateStars = (val: number) => {
            stars.forEach((s, idx) => {
                if (idx < val) {
                    s.style.color = '#ffd700';
                    s.style.textShadow = '0 0 8px rgba(255, 215, 0, 0.6)';
                } else {
                    s.style.color = '#444';
                    s.style.textShadow = 'none';
                }
            });
        };

        updateStars(selectedRating);

        stars.forEach((s, idx) => {
            s.addEventListener('mouseenter', () => updateStars(idx + 1));
            s.addEventListener('mouseleave', () => updateStars(selectedRating));
            s.addEventListener('click', () => {
                playSound(this, 'click');
                selectedRating = idx + 1;
                updateStars(selectedRating);
            });
        });

        const dismiss = () => {
            overlay.remove();
        };

        cancelBtn.addEventListener('click', () => {
            playSound(this, 'click');
            dismiss();
        });

        submitBtn.addEventListener('click', async () => {
            const author = authorInput.value.trim() || 'Guest';
            const comment = commentTextarea.value.trim();

            if (selectedRating === 0 && !comment) {
                alert('Please select a star rating or write a comment before submitting.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerText = 'Submitting...';

            let ratingSuccess = true;
            let commentSuccess = true;

            if (selectedRating > 0 && selectedRating !== userRating) {
                const uniqueUserId = cgUser ? cgUser.username : `guest-${Math.random().toString(36).substr(2, 9)}`;
                const { error: ratingErr } = await submitRating(this.communityMapId, uniqueUserId, selectedRating);
                if (ratingErr) {
                    console.error('Rating error:', ratingErr);
                    ratingSuccess = false;
                }
            }

            if (comment) {
                const { error: commentErr } = await submitComment(this.communityMapId, author, comment);
                if (commentErr) {
                    console.error('Comment error:', commentErr);
                    commentSuccess = false;
                }
            }

            if (!ratingSuccess || !commentSuccess) {
                alert('Some of your submissions failed. Please try again.');
                submitBtn.disabled = false;
                submitBtn.innerText = 'Submit';
            } else {
                playSound(this, 'collect');
                alert('Thank you! Your feedback has been submitted.');
                dismiss();
            }
        });
    }
}
