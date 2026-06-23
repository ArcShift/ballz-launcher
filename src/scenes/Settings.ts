import { Scene, GameObjects } from 'phaser';
import { GW, GH } from '../main';
import { playSound } from './Preloader';
import * as Phaser from 'phaser';

// ── Persistent settings stored in localStorage ──────────────────────────────
export interface GameSettings {
    soundVolume: number;    // 0–1
    musicVolume: number;    // 0–1
    fullscreen: boolean;
    showTrajectory: boolean;
    gravity: number;        // 300 | 600 | 900
}

const DEFAULTS: GameSettings = {
    soundVolume: 0.8,
    musicVolume: 0.5,
    fullscreen: false,
    showTrajectory: true,
    gravity: 600,
};

const STORAGE_KEY = 'hyperballz_settings';

export function loadSettings(): GameSettings {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch (_) { /* ignore */ }
    return { ...DEFAULTS };
}

export function saveSettings(s: GameSettings): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch (_) { /* ignore */ }
}

// ── Simple slider helper drawn on canvas ─────────────────────────────────────
interface SliderConfig {
    x: number; y: number;
    width: number;
    min: number; max: number;
    value: number;
    label: string;
    onChange: (v: number) => void;
}

// ── Settings Scene ────────────────────────────────────────────────────────────
export class Settings extends Scene {

    private settings: GameSettings;

    // track slider drag state
    private draggingSlider: { config: SliderConfig; graphics: GameObjects.Graphics; handle: GameObjects.Rectangle } | null = null;

    constructor() {
        super('Settings');
    }

    create() {
        this.settings = loadSettings();

        // ── Background ─────────────────────────────────────────────────────
        this.add.image(GW / 2, GH / 2, 'background').setDisplaySize(GW, GH);

        // ── Dark glass panel ───────────────────────────────────────────────
        const panelW = 680;
        const panelH = 560;
        const panelX = GW / 2 - panelW / 2;
        const panelY = GH / 2 - panelH / 2 + 20;

        const panelGfx = this.add.graphics();
        // Shadow
        panelGfx.fillStyle(0x000000, 0.35);
        panelGfx.fillRoundedRect(panelX + 8, panelY + 8, panelW, panelH, 20);
        // Panel body
        panelGfx.fillStyle(0x06101e, 0.85);
        panelGfx.fillRoundedRect(panelX, panelY, panelW, panelH, 20);
        // Cyan border
        panelGfx.lineStyle(3, 0x00ffff, 0.9);
        panelGfx.strokeRoundedRect(panelX, panelY, panelW, panelH, 20);
        // Subtle top highlight
        panelGfx.lineStyle(2, 0xffffff, 0.08);
        panelGfx.strokeRoundedRect(panelX + 2, panelY + 2, panelW - 4, panelH - 4, 18);

        // ── Title ─────────────────────────────────────────────────────────
        this.add.text(GW / 2, 60, '⚙  SETTINGS', {
            fontFamily: 'Fredoka, Arial Black',
            fontSize: '46px',
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 7,
        }).setOrigin(0.5);

        // ── Divider under title ────────────────────────────────────────────
        const divGfx = this.add.graphics();
        divGfx.lineStyle(2, 0x00ffff, 0.4);
        divGfx.lineBetween(panelX + 30, panelY + 56, panelX + panelW - 30, panelY + 56);

        // ── Section labels & rows start position ──────────────────────────
        const col1 = panelX + 30;
        const col2 = panelX + panelW - 30;
        let rowY = panelY + 80;
        const rowGap = 76;

        this.sectionLabel(col1, rowY - 4, '🔊  AUDIO');

        // ── Sound Volume slider ────────────────────────────────────────────
        rowY += 30;
        this.buildSlider({
            x: col1, y: rowY,
            width: panelW - 60,
            min: 0, max: 1,
            value: this.settings.soundVolume,
            label: 'Sound Effects',
            onChange: (v) => {
                this.settings.soundVolume = v;
                saveSettings(this.settings);
            }
        });

        rowY += rowGap;
        this.buildSlider({
            x: col1, y: rowY,
            width: panelW - 60,
            min: 0, max: 1,
            value: this.settings.musicVolume,
            label: 'Music Volume',
            onChange: (v) => {
                this.settings.musicVolume = v;
                saveSettings(this.settings);
            }
        });

        // ── Section: Display ──────────────────────────────────────────────
        rowY += rowGap + 10;
        const divGfx2 = this.add.graphics();
        divGfx2.lineStyle(1, 0x00ffff, 0.2);
        divGfx2.lineBetween(col1, rowY - 14, col2, rowY - 14);

        this.sectionLabel(col1, rowY - 4, '🖥  DISPLAY');

        rowY += 28;
        this.buildToggleRow(col1, col2, rowY, 'Fullscreen Mode', this.settings.fullscreen,
            (val) => {
                this.settings.fullscreen = val;
                saveSettings(this.settings);
                this.scale.toggleFullscreen();
            }
        );

        rowY += rowGap - 14;
        this.buildToggleRow(col1, col2, rowY, 'Show Trajectory', this.settings.showTrajectory,
            (val) => {
                this.settings.showTrajectory = val;
                saveSettings(this.settings);
            }
        );

        // ── Section: Gameplay ─────────────────────────────────────────────
        rowY += rowGap - 10;
        const divGfx3 = this.add.graphics();
        divGfx3.lineStyle(1, 0x00ffff, 0.2);
        divGfx3.lineBetween(col1, rowY - 14, col2, rowY - 14);

        this.sectionLabel(col1, rowY - 4, '🎮  GAMEPLAY');

        rowY += 28;
        this.buildGravityRow(col1, col2, rowY);

        // ── Reset button ──────────────────────────────────────────────────
        rowY += rowGap - 8;
        this.buildTextButton(GW / 2 - 150, rowY, '↺  RESET SETTINGS', '#888888', '#ffaa00',
            () => {
                this.settings = { ...DEFAULTS };
                saveSettings(this.settings);
                playSound(this, 'click');
                // Restart scene to redraw
                this.scene.restart();
            }
        );

        this.buildTextButton(GW / 2 + 150, rowY, '⚠  RESET CAMPAIGN', '#ff4444', '#ff8888',
            () => {
                playSound(this, 'destroy');
                if (confirm('Are you sure you want to reset all campaign progress?')) {
                    localStorage.removeItem('ballz_campaign_stars');
                    localStorage.removeItem('ballz_campaign_page');
                    alert('Campaign progress has been reset.');
                }
            }
        );

        // ── Back button ───────────────────────────────────────────────────
        this.buildTextButton(GW / 2, GH - 38, '◄  BACK TO MENU', '#ffffff', '#00ffff',
            () => {
                playSound(this, 'click');
                this.scene.start('MainMenu');
            }
        );

        // ── Global pointer move / up for slider drag ─────────────────────
        this.input.on('pointermove', (ptr: Phaser.Input.Pointer) => {
            if (!this.draggingSlider) return;
            const { config, graphics, handle } = this.draggingSlider;
            const t = Phaser.Math.Clamp((ptr.x - config.x) / config.width, 0, 1);
            const newVal = config.min + t * (config.max - config.min);
            handle.x = config.x + t * config.width;
            this.redrawTrack(graphics, config, t);
            config.onChange(newVal);
        });

        this.input.on('pointerup', () => {
            this.draggingSlider = null;
        });

        // ── Particle sparkles in background ──────────────────────────────
        this.spawnParticles();
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private sectionLabel(x: number, y: number, text: string) {
        this.add.text(x, y, text, {
            fontFamily: 'Fredoka, Arial',
            fontSize: '20px',
            color: '#00ffff',
            alpha: 0.85,
        });
    }

    private buildSlider(cfg: SliderConfig) {
        const trackH = 6;
        const handleSize = 18;
        const trackY = cfg.y + 32;

        // Label
        this.add.text(cfg.x, cfg.y, cfg.label, {
            fontFamily: 'Fredoka, Arial',
            fontSize: '22px',
            color: '#e0e0e0',
        });

        // Value percentage text (right-aligned)
        const pct = Math.round(((cfg.value - cfg.min) / (cfg.max - cfg.min)) * 100);
        const valText = this.add.text(cfg.x + cfg.width, cfg.y, `${pct}%`, {
            fontFamily: 'Fredoka, Arial',
            fontSize: '20px',
            color: '#00ffff',
        }).setOrigin(1, 0);

        // Track graphics
        const t0 = (cfg.value - cfg.min) / (cfg.max - cfg.min);
        const gfx = this.add.graphics();
        this.redrawTrack(gfx, cfg, t0);

        // Handle (interactive rectangle)
        const handle = this.add.rectangle(cfg.x + t0 * cfg.width, trackY, handleSize, handleSize, 0x00ffff)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        // Hover glow
        handle.on('pointerover', () => handle.setFillStyle(0xffffff));
        handle.on('pointerout', () => handle.setFillStyle(0x00ffff));

        handle.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
            // Override cfg.value so drag re-reads correctly
            this.draggingSlider = { config: cfg, graphics: gfx, handle };
        });

        // Also allow clicking anywhere on the track
        const trackZone = this.add.zone(cfg.x + cfg.width / 2, trackY, cfg.width, 20)
            .setInteractive({ useHandCursor: true });

        trackZone.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
            const t = Phaser.Math.Clamp((ptr.x - cfg.x) / cfg.width, 0, 1);
            const newVal = cfg.min + t * (cfg.max - cfg.min);
            handle.x = cfg.x + t * cfg.width;
            this.redrawTrack(gfx, cfg, t);
            valText.setText(`${Math.round(t * 100)}%`);
            cfg.onChange(newVal);
            this.draggingSlider = { config: cfg, graphics: gfx, handle };
        });

        // Keep value text in sync during drag
        cfg.onChange = ((originalOnChange) => (v: number) => {
            const frac = (v - cfg.min) / (cfg.max - cfg.min);
            valText.setText(`${Math.round(frac * 100)}%`);
            originalOnChange(v);
        })(cfg.onChange);
    }

    private redrawTrack(gfx: GameObjects.Graphics, cfg: SliderConfig, t: number) {
        const trackY = cfg.y + 32;
        gfx.clear();
        // Background track
        gfx.fillStyle(0x1a3344, 1);
        gfx.fillRoundedRect(cfg.x, trackY - 3, cfg.width, 6, 3);
        // Filled portion
        gfx.fillStyle(0x00ffff, 0.8);
        gfx.fillRoundedRect(cfg.x, trackY - 3, t * cfg.width, 6, 3);
    }

    private buildToggleRow(
        x: number, rightX: number, y: number,
        label: string, initial: boolean,
        onChange: (v: boolean) => void
    ) {
        this.add.text(x, y, label, {
            fontFamily: 'Fredoka, Arial',
            fontSize: '22px',
            color: '#e0e0e0',
        }).setOrigin(0, 0.5);

        // Toggle pill
        const pillW = 64;
        const pillH = 30;
        const pillX = rightX - pillW / 2;

        let state = initial;
        const pillGfx = this.add.graphics();
        const knob = this.add.circle(0, 0, 11, 0xffffff).setDepth(1);

        const drawToggle = () => {
            pillGfx.clear();
            pillGfx.fillStyle(state ? 0x00ffff : 0x2a3a4a, 1);
            pillGfx.fillRoundedRect(pillX - pillW / 2, y - pillH / 2, pillW, pillH, pillH / 2);
            pillGfx.lineStyle(2, state ? 0x00cccc : 0x445566, 1);
            pillGfx.strokeRoundedRect(pillX - pillW / 2, y - pillH / 2, pillW, pillH, pillH / 2);
            knob.setPosition(
                state ? pillX + pillW / 2 - 16 : pillX - pillW / 2 + 16,
                y
            );
            knob.setFillStyle(state ? 0xffffff : 0x667788);
        };
        drawToggle();

        // Zone over pill
        const zone = this.add.zone(pillX, y, pillW + 10, pillH + 10).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => {
            state = !state;
            drawToggle();
            playSound(this, 'click');
            onChange(state);
        });

        // Hover effect
        zone.on('pointerover', () => { pillGfx.setAlpha(0.85); });
        zone.on('pointerout', () => { pillGfx.setAlpha(1); });

        // On/Off label
        const stateLabel = this.add.text(pillX - pillW / 2 - 12, y, state ? 'ON' : 'OFF', {
            fontFamily: 'Fredoka',
            fontSize: '16px',
            color: state ? '#00ffff' : '#556677',
        }).setOrigin(1, 0.5);

        zone.on('pointerdown', () => {
            // update label (fires after the first listener)
        });

        // Patch onChange to also update the label
        const wrappedChange = onChange;
        zone.off('pointerdown');
        zone.on('pointerdown', () => {
            state = !state;
            drawToggle();
            playSound(this, 'click');
            stateLabel.setText(state ? 'ON' : 'OFF');
            stateLabel.setColor(state ? '#00ffff' : '#556677');
            wrappedChange(state);
        });
    }

    private buildGravityRow(x: number, rightX: number, y: number) {
        this.add.text(x, y, 'Gravity', {
            fontFamily: 'Fredoka, Arial',
            fontSize: '22px',
            color: '#e0e0e0',
        }).setOrigin(0, 0.5);

        const options = [
            { label: 'LOW', value: 300 },
            { label: 'NORMAL', value: 600 },
            { label: 'HIGH', value: 900 },
        ];

        const btnW = 90;
        const gap = 10;
        const totalW = options.length * btnW + (options.length - 1) * gap;
        let startX = rightX - totalW;

        const buttons: { gfx: GameObjects.Graphics; label: GameObjects.Text; value: number }[] = [];

        options.forEach((opt, i) => {
            const bx = startX + i * (btnW + gap);
            const by = y;

            const gfx = this.add.graphics();
            const lbl = this.add.text(bx + btnW / 2, by, opt.label, {
                fontFamily: 'Fredoka',
                fontSize: '17px',
                color: '#ffffff',
            }).setOrigin(0.5);

            const selected = this.settings.gravity === opt.value;
            buttons.push({ gfx, label: lbl, value: opt.value });

            const drawBtn = (active: boolean) => {
                gfx.clear();
                gfx.fillStyle(active ? 0x00ffff : 0x1a2a3a, active ? 0.9 : 0.8);
                gfx.fillRoundedRect(bx, by - 16, btnW, 32, 8);
                gfx.lineStyle(2, active ? 0x00ffff : 0x334455, 1);
                gfx.strokeRoundedRect(bx, by - 16, btnW, 32, 8);
                lbl.setColor(active ? '#000000' : '#aaaaaa');
            };

            drawBtn(selected);

            const zone = this.add.zone(bx + btnW / 2, by, btnW, 32).setInteractive({ useHandCursor: true });
            zone.on('pointerover', () => {
                if (this.settings.gravity !== opt.value) {
                    gfx.lineStyle(2, 0x00ffff, 0.6);
                    gfx.strokeRoundedRect(bx, by - 16, btnW, 32, 8);
                }
            });
            zone.on('pointerout', () => drawBtn(this.settings.gravity === opt.value));
            zone.on('pointerdown', () => {
                this.settings.gravity = opt.value;
                saveSettings(this.settings);
                playSound(this, 'click');
                buttons.forEach(b => drawBtn(b.value === opt.value));
                // Also update all button visuals
                buttons.forEach(b => {
                    b.gfx.clear();
                    const active = b.value === this.settings.gravity;
                    b.gfx.fillStyle(active ? 0x00ffff : 0x1a2a3a, active ? 0.9 : 0.8);
                    b.gfx.fillRoundedRect(
                        rightX - totalW + buttons.indexOf(b) * (btnW + gap),
                        by - 16, btnW, 32, 8
                    );
                    b.gfx.lineStyle(2, active ? 0x00ffff : 0x334455, 1);
                    b.gfx.strokeRoundedRect(
                        rightX - totalW + buttons.indexOf(b) * (btnW + gap),
                        by - 16, btnW, 32, 8
                    );
                    b.label.setColor(active ? '#000000' : '#aaaaaa');
                });
            });
        });
    }

    private buildTextButton(x: number, y: number, text: string, color: string, hoverColor: string, onClick: () => void) {
        const btn = this.add.text(x, y, text, {
            fontFamily: 'Fredoka, Arial Black',
            fontSize: '24px',
            color,
            stroke: '#000000',
            strokeThickness: 5,
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setColor(hoverColor).setScale(1.06));
        btn.on('pointerout', () => btn.setColor(color).setScale(1));
        btn.on('pointerdown', onClick);
        return btn;
    }

    private spawnParticles() {
        // Subtle floating dots for atmosphere
        for (let i = 0; i < 18; i++) {
            const px = Phaser.Math.Between(20, GW - 20);
            const py = Phaser.Math.Between(20, GH - 20);
            const dot = this.add.circle(px, py, Phaser.Math.Between(1, 3), 0x00ffff, 0.15 + Math.random() * 0.2);
            this.tweens.add({
                targets: dot,
                y: py - Phaser.Math.Between(30, 80),
                alpha: 0,
                duration: 3000 + Math.random() * 4000,
                repeat: -1,
                yoyo: false,
                delay: Math.random() * 3000,
                onRepeat: () => {
                    dot.x = Phaser.Math.Between(20, GW - 20);
                    dot.y = Phaser.Math.Between(GH / 2, GH - 20);
                    dot.setAlpha(0.15 + Math.random() * 0.2);
                }
            });
        }
    }
}
