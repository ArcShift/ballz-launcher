import { GW, GH } from '../main';
import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor () {
        super('Preloader');
    }

    init () {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(GW/2, GH/2, 'background').setDisplaySize(GW, GH);

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload () {
        // Set path for other assets if any
        this.load.setPath('img');
        this.load.spritesheet('sprite', 'ball.png', { frameWidth: 128, frameHeight: 128 });

        this.load.setPath('music');
        this.load.audio('main-theme', 'main-theme.mp3');
    }

    async create ()
    {
        // Generate spritesheet programmatically
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        
        this.drawSpritesheet(canvas);

        // Add to texture manager
        this.textures.addCanvas('spritesheet', canvas);

        // Create frames for the spritesheet (4x4 grid, each 64x64)
        const texture = this.textures.get('spritesheet');
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const index = y * 4 + x;
                texture.add(index.toString(), 0, x * 64, y * 64, 64, 64);
            }
        }

        // Wait for font to load
        if (document.fonts) {
            await document.fonts.load('10pt "Fredoka"');
        }

        // Move to the MainMenu
        this.scene.start('MainMenu');
    }

    private drawSpritesheet(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, 256, 256);

        // Sphere helper
        const drawSphere = (x: number, y: number, color1: string, color2: string, glowColor: string, detailDraw?: (ctx: CanvasRenderingContext2D, cx: number, cy: number) => void) => {
            const cx = x + 32;
            const cy = y + 32;
            const r = 20;

            // Glow
            ctx.beginPath();
            const glow = ctx.createRadialGradient(cx, cy, r - 5, cx, cy, r + 8);
            glow.addColorStop(0, glowColor + '88');
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow;
            ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
            ctx.fill();

            // Sphere
            ctx.beginPath();
            const grad = ctx.createRadialGradient(cx - 6, cy - 6, 2, cx, cy, r);
            grad.addColorStop(0, color1);
            grad.addColorStop(1, color2);
            ctx.fillStyle = grad;
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();

            // Outline
            ctx.strokeStyle = glowColor;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Detail
            if (detailDraw) {
                ctx.save();
                detailDraw(ctx, cx, cy);
                ctx.restore();
            }
        };

        // Frame 0: Normal Ball (Blue glow)
        drawSphere(0, 0, '#e0ffff', '#008b8b', '#00ffff');

        // Frame 1: Sticky Ball (Green slime)
        drawSphere(64, 0, '#adff2f', '#228b22', '#32cd32', (c, cx, cy) => {
            c.fillStyle = '#adff2f';
            const angles = [0, Math.PI / 3, Math.PI * 2 / 3, Math.PI, Math.PI * 4 / 3, Math.PI * 5 / 3];
            angles.forEach(a => {
                const sx = cx + Math.cos(a) * 20;
                const sy = cy + Math.sin(a) * 20;
                c.beginPath();
                c.arc(sx, sy, 5, 0, Math.PI * 2);
                c.fill();
            });
        });

        // Frame 2: Rubber Ball (Yellow/orange striped)
        drawSphere(128, 0, '#fffacd', '#ff8c00', '#ffd700', (c, cx, cy) => {
            c.strokeStyle = '#8b4513';
            c.lineWidth = 3;
            c.beginPath();
            c.arc(cx, cy, 20, Math.PI * 0.25, Math.PI * 0.75);
            c.stroke();
            c.beginPath();
            c.arc(cx, cy, 20, Math.PI * 1.25, Math.PI * 1.75);
            c.stroke();
        });

        // Frame 3: Anti Gravity Ball (Purple with chevrons)
        drawSphere(192, 0, '#ee82ee', '#4b0082', '#ba55d3', (c, cx, cy) => {
            c.fillStyle = '#ffffff';
            // Draw 2 arrows pointing up
            c.beginPath();
            c.moveTo(cx - 8, cy + 5);
            c.lineTo(cx, cy - 3);
            c.lineTo(cx + 8, cy + 5);
            c.lineTo(cx + 4, cy + 5);
            c.lineTo(cx, cy + 1);
            c.lineTo(cx - 4, cy + 5);
            c.closePath();
            c.fill();

            c.beginPath();
            c.moveTo(cx - 8, cy - 2);
            c.lineTo(cx, cy - 10);
            c.lineTo(cx + 8, cy - 2);
            c.lineTo(cx + 4, cy - 2);
            c.lineTo(cx, cy - 6);
            c.lineTo(cx - 4, cy - 2);
            c.closePath();
            c.fill();
        });

        // Frame 4: Metal Ball (Chrome / Steel)
        drawSphere(0, 64, '#ffffff', '#2f4f4f', '#708090', (c, cx, cy) => {
            c.fillStyle = '#ffffff';
            c.beginPath();
            c.arc(cx - 5, cy - 5, 4, 0, Math.PI * 2);
            c.fill();
            c.fillStyle = '#1e2d2d';
            const dots = [[-10, 0], [10, 0], [0, -10], [0, 10]];
            dots.forEach(d => {
                c.beginPath();
                c.arc(cx + d[0], cy + d[1], 2, 0, Math.PI * 2);
                c.fill();
            });
        });

        // Frame 5: Nitro Ball (Red rocket)
        drawSphere(64, 64, '#ff6347', '#8b0000', '#ff0000', (c, cx, cy) => {
            c.fillStyle = '#ffd700';
            c.beginPath();
            c.moveTo(cx - 15, cy + 10);
            c.lineTo(cx - 25, cy + 15);
            c.lineTo(cx - 20, cy + 5);
            c.closePath();
            c.fill();
            
            c.beginPath();
            c.moveTo(cx - 15, cy - 10);
            c.lineTo(cx - 25, cy - 15);
            c.lineTo(cx - 20, cy - 5);
            c.closePath();
            c.fill();
        });

        // Frame 6: Flame Ball (Fireball)
        drawSphere(128, 64, '#ffe4b5', '#d2691e', '#ff4500', (c, cx, cy) => {
            c.fillStyle = '#ff8c00';
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4;
                const fx = cx + Math.cos(angle) * 18;
                const fy = cy + Math.sin(angle) * 18;
                c.beginPath();
                c.arc(fx, fy, 6, 0, Math.PI * 2);
                c.fill();
            }
        });

        // Frame 7: Matroshka Ball (Pink nesting)
        drawSphere(192, 64, '#ffc0cb', '#c71585', '#ff1493', (c, cx, cy) => {
            c.strokeStyle = '#ffffff';
            c.lineWidth = 2;
            c.beginPath();
            c.arc(cx, cy, 12, 0, Math.PI * 2);
            c.stroke();
            c.beginPath();
            c.arc(cx, cy, 6, 0, Math.PI * 2);
            c.stroke();
        });

        // Frame 8: Goal Portal (Vortex)
        {
            const cx = 32;
            const cy = 128 + 32;
            ctx.beginPath();
            const portalGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 25);
            portalGrad.addColorStop(0, '#000000');
            portalGrad.addColorStop(0.5, '#4b0082');
            portalGrad.addColorStop(0.8, '#00ffff');
            portalGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = portalGrad;
            ctx.arc(cx, cy, 28, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let a = 0; a < Math.PI * 4; a += 0.1) {
                const r = 4 + a * 1.8;
                const px = cx + Math.cos(a) * r;
                const py = cy + Math.sin(a) * r;
                if (a === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
        }

        // Frame 9: Spikes (Hazard)
        {
            const x = 64;
            const y = 128;
            ctx.fillStyle = '#708090';
            ctx.strokeStyle = '#dcdcdc';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let i = 0; i < 3; i++) {
                const sx = x + 8 + i * 16;
                ctx.moveTo(sx, y + 56);
                ctx.lineTo(sx + 12, y + 16);
                ctx.lineTo(sx + 24, y + 56);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        // Frame 10: Star (Collectible)
        {
            const cx = 128 + 32;
            const cy = 128 + 32;
            ctx.fillStyle = '#ffd700';
            ctx.strokeStyle = '#fff8dc';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            const spikes = 5;
            const outerRadius = 22;
            const innerRadius = 9;
            let rot = (Math.PI / 2) * 3;
            const step = Math.PI / spikes;

            ctx.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
                let px = cx + Math.cos(rot) * outerRadius;
                let py = cy + Math.sin(rot) * outerRadius;
                ctx.lineTo(px, py);
                rot += step;

                px = cx + Math.cos(rot) * innerRadius;
                py = cy + Math.sin(rot) * innerRadius;
                ctx.lineTo(px, py);
                rot += step;
            }
            ctx.lineTo(cx, cy - outerRadius);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        // Frame 11: Standard Brick
        {
            const x = 192;
            const y = 128;
            ctx.fillStyle = '#1c2438';
            ctx.fillRect(x + 4, y + 4, 56, 56);
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.strokeRect(x + 4, y + 4, 56, 56);
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
            ctx.lineWidth = 7;
            ctx.strokeRect(x + 4, y + 4, 56, 56);
        }

        // Frame 12: Weak Brick
        {
            const x = 0;
            const y = 192;
            ctx.fillStyle = '#8b7d7b';
            ctx.fillRect(x + 4, y + 4, 56, 56);
            ctx.strokeStyle = '#4a3c31';
            ctx.lineWidth = 3;
            ctx.strokeRect(x + 4, y + 4, 56, 56);
            ctx.strokeStyle = '#3e2723';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + 10, y + 10);
            ctx.lineTo(x + 30, y + 25);
            ctx.lineTo(x + 25, y + 45);
            ctx.lineTo(x + 50, y + 50);
            ctx.moveTo(x + 30, y + 25);
            ctx.lineTo(x + 50, y + 15);
            ctx.stroke();
        }

        // Frame 13: Flammable Brick
        {
            const x = 64;
            const y = 192;
            ctx.fillStyle = '#cd853f';
            ctx.fillRect(x + 4, y + 4, 56, 56);
            ctx.strokeStyle = '#8b4513';
            ctx.lineWidth = 3;
            ctx.strokeRect(x + 4, y + 4, 56, 56);
            ctx.strokeStyle = '#5c2d16';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + 10, y + 15);
            ctx.lineTo(x + 54, y + 15);
            ctx.moveTo(x + 10, y + 32);
            ctx.lineTo(x + 54, y + 32);
            ctx.moveTo(x + 10, y + 49);
            ctx.lineTo(x + 54, y + 49);
            ctx.stroke();
            
            ctx.fillStyle = '#228b22';
            ctx.beginPath();
            ctx.ellipse(x + 32, y + 32, 10, 6, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Frame 14: Ceil Platform / Sticky Platform
        {
            const x = 128;
            const y = 192;
            ctx.fillStyle = '#303030';
            ctx.fillRect(x + 4, y + 4, 56, 56);
            ctx.strokeStyle = '#505050';
            ctx.lineWidth = 3;
            ctx.strokeRect(x + 4, y + 4, 56, 56);
            
            ctx.fillStyle = '#228b22';
            ctx.fillRect(x + 4, y + 4, 56, 12);
            
            ctx.beginPath();
            ctx.arc(x + 15, y + 16, 5, 0, Math.PI * 2);
            ctx.arc(x + 32, y + 20, 6, 0, Math.PI * 2);
            ctx.arc(x + 48, y + 17, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Frame 15: Launcher
        {
            const x = 192;
            const y = 192;
            ctx.fillStyle = '#4f4f4f';
            ctx.beginPath();
            ctx.ellipse(x + 32, y + 48, 24, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#8b8b8b';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.fillRect(x + 20, y + 12, 24, 28);
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x + 20, y + 12, 24, 28);
        }
    }
}

// Global Synthesizer Helper for sound effects
export function playSound(scene: Phaser.Scene, type: 'bounce' | 'portal' | 'collect' | 'destroy' | 'launch' | 'click' | 'break' | 'burn') {
    const soundManager = scene.game.sound;
    const ctx = (soundManager as any).context || new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    const sv = scene.registry.get('soundVolume');
    const masterVol = sv !== undefined ? sv : 0.8;
    if (masterVol <= 0) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const masterGain = ctx.createGain();
    masterGain.gain.value = masterVol;

    osc.connect(gain);
    gain.connect(masterGain);
    masterGain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'bounce') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    } else if (type === 'launch') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
    } else if (type === 'collect') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
    } else if (type === 'portal') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.6);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
    } else if (type === 'destroy') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.3);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
    } else if (type === 'break' || type === 'burn') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(30, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
    }
}
