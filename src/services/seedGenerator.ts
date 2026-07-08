import { LevelData } from '../entities/Level';
import * as Phaser from 'phaser';

// ── Mulberry32 PRNG ──────────────────────────────────────────────────────────
// Fast, deterministic, seed-based pseudo-random number generator.
function mulberry32(seed: number) {
    return function () {
        seed |= 0;
        seed = seed + 0x6d2b79f5 | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** Parse a seed string (e.g. "BALL-1234") into a numeric seed. */
export function parseSeedString(seedStr: string): number {
    // Strip non-numeric characters, then parse as int
    const cleaned = seedStr.replace(/[^0-9]/g, '');
    if (cleaned.length === 0) return 1;
    return Math.abs(parseInt(cleaned, 10)) || 1;
}

/** Format a numeric seed as a human-readable string. */
export function formatSeed(seed: number): string {
    return `SEED-${seed.toString().padStart(6, '0')}`;
}

// ── Constants for the game canvas ────────────────────────────────────────────
const GW = 1024;
const GH = 768;

// Block types
const BLOCK_STANDARD   = 11;
const BLOCK_WEAK       = 12;
const BLOCK_FLAMMABLE  = 13;
const BLOCK_STICKY     = 14;
const BLOCK_TYPES      = [BLOCK_STANDARD, BLOCK_WEAK, BLOCK_FLAMMABLE, BLOCK_STICKY];

// Ball types (0-7)
const ALL_BALLS = [0, 1, 2, 3, 4, 5, 6, 7];

// Grid constants (blocks are ~64px, placed on a loose grid)
const GRID_STEP = 64;

// Safe play zones
const LEFT_MARGIN   = 140;  // stay right of launcher
const RIGHT_MARGIN  = GW - 140; // stay left of portal
const TOP_MARGIN    = 100;
const BOTTOM_MARGIN = GH - 100;

// ── Helper: snap to grid ──────────────────────────────────────────────────────
function snapGrid(v: number, step = GRID_STEP) {
    return Math.round(v / step) * step;
}

// ── Pattern generators ────────────────────────────────────────────────────────
type BlockDef = { x: number; y: number; type: number };
type SpikeDef = { x: number; y: number };
type StarDef  = { x: number; y: number };

interface GeneratedLayout {
    blocks: BlockDef[];
    spikes: SpikeDef[];
    stars:  StarDef[];
    launcher: { x: number; y: number };
    portal:   { x: number; y: number };
}

/**
 * Generate a deterministic level layout from a numeric seed.
 * The algorithm:
 *  1. Randomise launcher + portal positions
 *  2. Pick a structure template (wall, pillars, maze-ish)
 *  3. Scatter some spikes
 *  4. Place 3 stars in safe spots
 *  5. Choose 3-5 balls that suit the obstacles
 */
export function generateLevelFromSeed(seed: number): LevelData {
    const rand = mulberry32(seed);

    // ── 1. Launcher & Portal ──────────────────────────────────────────────────
    // Launcher is always on the left half, portal on the right half
    const launcherY = snapGrid(BOTTOM_MARGIN - rand() * 300, GRID_STEP);
    const launcher  = { x: 140, y: Phaser.Math.Clamp(launcherY, 300, GH - 80) };

    const portalY = snapGrid(BOTTOM_MARGIN - rand() * 500, GRID_STEP);
    const portal  = { x: GW - 140, y: Phaser.Math.Clamp(portalY, 100, GH - 80) };

    // ── 2. Structure template ─────────────────────────────────────────────────
    const templateIndex = Math.floor(rand() * 6); // 6 templates

    const blocks: BlockDef[] = [];
    const spikes: SpikeDef[] = [];

    switch (templateIndex) {
        case 0: buildWallTemplate(rand, blocks, spikes);     break;
        case 1: buildPillarTemplate(rand, blocks, spikes);   break;
        case 2: buildPlatformTemplate(rand, blocks, spikes); break;
        case 3: buildZigzagTemplate(rand, blocks, spikes);   break;
        case 4: buildCageTemplate(rand, blocks, spikes);     break;
        case 5: buildScatterTemplate(rand, blocks, spikes);  break;
    }

    // ── 3. Stars (3 always) ───────────────────────────────────────────────────
    const stars = generateStars(rand, blocks);

    // ── 4. Ball selection ─────────────────────────────────────────────────────
    const balls = chooseBalls(rand, blocks);

    return { launcher, portal, blocks, spikes, stars, balls };
}

// ── Template builders ─────────────────────────────────────────────────────────

/** Vertical wall(s) spanning parts of the height */
function buildWallTemplate(rand: () => number, blocks: BlockDef[], spikes: SpikeDef[]) {
    const numWalls = 1 + Math.floor(rand() * 3); // 1-3 walls

    for (let w = 0; w < numWalls; w++) {
        const wx = snapGrid(LEFT_MARGIN + rand() * (RIGHT_MARGIN - LEFT_MARGIN), GRID_STEP);
        const wallTopY = snapGrid(TOP_MARGIN + rand() * 300, GRID_STEP);
        const wallBottomY = snapGrid(wallTopY + 100 + rand() * 300, GRID_STEP);
        const blockType = BLOCK_TYPES[Math.floor(rand() * BLOCK_TYPES.length)];

        for (let y = wallTopY; y <= wallBottomY; y += GRID_STEP) {
            blocks.push({ x: wx, y, type: blockType });
        }

        // Sometimes add a spike at base of wall
        if (rand() > 0.5 && wallBottomY < GH - 100) {
            spikes.push({ x: wx, y: wallBottomY + GRID_STEP });
        }
    }
}

/** Pillars rising from the floor */
function buildPillarTemplate(rand: () => number, blocks: BlockDef[], spikes: SpikeDef[]) {
    const numPillars = 2 + Math.floor(rand() * 3); // 2-4 pillars

    for (let p = 0; p < numPillars; p++) {
        const px = snapGrid(LEFT_MARGIN + 80 + (p / numPillars) * (RIGHT_MARGIN - LEFT_MARGIN - 160), GRID_STEP);
        const height = 2 + Math.floor(rand() * 4); // 2-5 blocks
        const blockType = BLOCK_TYPES[Math.floor(rand() * BLOCK_TYPES.length)];

        for (let h = 0; h < height; h++) {
            blocks.push({ x: px, y: GH - 80 - h * GRID_STEP, type: blockType });
        }

        // Cap with spike or sticky
        if (rand() > 0.6) {
            spikes.push({ x: px, y: GH - 80 - height * GRID_STEP });
        }
    }
}

/** Floating horizontal platforms */
function buildPlatformTemplate(rand: () => number, blocks: BlockDef[], spikes: SpikeDef[]) {
    const numPlatforms = 2 + Math.floor(rand() * 3); // 2-4 platforms

    for (let p = 0; p < numPlatforms; p++) {
        const py = snapGrid(TOP_MARGIN + rand() * (BOTTOM_MARGIN - TOP_MARGIN - 100), GRID_STEP);
        const px = snapGrid(LEFT_MARGIN + rand() * 300, GRID_STEP);
        const len = 2 + Math.floor(rand() * 4); // 2-5 blocks wide
        const blockType = BLOCK_TYPES[Math.floor(rand() * BLOCK_TYPES.length)];

        for (let i = 0; i < len; i++) {
            blocks.push({ x: px + i * GRID_STEP, y: py, type: blockType });
        }

        // Sometimes spikes below platform
        if (rand() > 0.6) {
            spikes.push({ x: px + Math.floor(len / 2) * GRID_STEP, y: py + GRID_STEP });
        }
    }
}

/** Zigzag staircase pattern */
function buildZigzagTemplate(rand: () => number, blocks: BlockDef[], spikes: SpikeDef[]) {
    const steps = 3 + Math.floor(rand() * 4); // 3-6 steps
    const blockType = BLOCK_TYPES[Math.floor(rand() * BLOCK_TYPES.length)];
    const startX = snapGrid(LEFT_MARGIN + 100, GRID_STEP);
    const startY = snapGrid(BOTTOM_MARGIN - 100, GRID_STEP);

    for (let s = 0; s < steps; s++) {
        const bx = startX + s * GRID_STEP * 2;
        const by = startY - s * GRID_STEP;
        blocks.push({ x: bx, y: by, type: blockType });
        blocks.push({ x: bx + GRID_STEP, y: by, type: blockType });

        if (rand() > 0.7) {
            spikes.push({ x: bx, y: by + GRID_STEP });
        }
    }
}

/** Box / cage structures */
function buildCageTemplate(rand: () => number, blocks: BlockDef[], spikes: SpikeDef[]) {
    const numCages = 1 + Math.floor(rand() * 2);

    for (let c = 0; c < numCages; c++) {
        const cx = snapGrid(LEFT_MARGIN + 100 + rand() * (RIGHT_MARGIN - LEFT_MARGIN - 250), GRID_STEP);
        const cy = snapGrid(TOP_MARGIN + rand() * 350, GRID_STEP);
        const w  = 2 + Math.floor(rand() * 2); // 2-3 wide
        const h  = 2 + Math.floor(rand() * 2); // 2-3 tall
        const blockType = BLOCK_TYPES[Math.floor(rand() * BLOCK_TYPES.length)];

        // Only perimeter
        for (let bx = 0; bx <= w; bx++) {
            for (let by = 0; by <= h; by++) {
                if (bx === 0 || bx === w || by === 0 || by === h) {
                    // Leave a gap on one side so ball can enter
                    const gapSide = Math.floor(rand() * 4);
                    const skipEdge =
                        (gapSide === 0 && bx === 0 && by === Math.floor(h / 2)) ||
                        (gapSide === 1 && bx === w && by === Math.floor(h / 2)) ||
                        (gapSide === 2 && by === 0 && bx === Math.floor(w / 2)) ||
                        (gapSide === 3 && by === h && bx === Math.floor(w / 2));
                    if (!skipEdge) {
                        blocks.push({ x: cx + bx * GRID_STEP, y: cy + by * GRID_STEP, type: blockType });
                    }
                }
            }
        }
    }

    // Scattered spikes
    const numSpikes = Math.floor(rand() * 3);
    for (let s = 0; s < numSpikes; s++) {
        spikes.push({
            x: snapGrid(LEFT_MARGIN + rand() * (RIGHT_MARGIN - LEFT_MARGIN), GRID_STEP),
            y: GH - 80
        });
    }
}

/** Random scatter of blocks */
function buildScatterTemplate(rand: () => number, blocks: BlockDef[], spikes: SpikeDef[]) {
    const numBlocks = 4 + Math.floor(rand() * 8); // 4-11 blocks

    for (let b = 0; b < numBlocks; b++) {
        blocks.push({
            x: snapGrid(LEFT_MARGIN + rand() * (RIGHT_MARGIN - LEFT_MARGIN), GRID_STEP),
            y: snapGrid(TOP_MARGIN + rand() * (BOTTOM_MARGIN - TOP_MARGIN - 100), GRID_STEP),
            type: BLOCK_TYPES[Math.floor(rand() * BLOCK_TYPES.length)]
        });
    }

    const numSpikes = Math.floor(rand() * 4);
    for (let s = 0; s < numSpikes; s++) {
        spikes.push({
            x: snapGrid(LEFT_MARGIN + rand() * (RIGHT_MARGIN - LEFT_MARGIN), GRID_STEP),
            y: GH - 80
        });
    }
}

// ── Star placement ────────────────────────────────────────────────────────────
function generateStars(rand: () => number, blocks: BlockDef[]): StarDef[] {
    const stars: StarDef[] = [];
    const blockSet = new Set(blocks.map(b => `${b.x},${b.y}`));

    const attempts = 30;
    let tries = 0;

    while (stars.length < 3 && tries < attempts) {
        tries++;
        const sx = snapGrid(LEFT_MARGIN + 50 + rand() * (RIGHT_MARGIN - LEFT_MARGIN - 100), GRID_STEP);
        const sy = snapGrid(TOP_MARGIN + rand() * (BOTTOM_MARGIN - TOP_MARGIN - 80), GRID_STEP);

        // Not on a block and not too close to another star
        if (blockSet.has(`${sx},${sy}`)) continue;
        const tooClose = stars.some(s => Math.abs(s.x - sx) < 80 && Math.abs(s.y - sy) < 80);
        if (tooClose) continue;

        stars.push({ x: sx, y: sy });
    }

    // Fallback: default spread
    while (stars.length < 3) {
        stars.push({ x: 300 + stars.length * 180, y: 300 });
    }

    return stars;
}

// ── Ball selection ────────────────────────────────────────────────────────────
function chooseBalls(rand: () => number, blocks: BlockDef[]): number[] {
    const blockTypes = new Set(blocks.map(b => b.type));
    const pool: number[] = [0]; // always include normal ball

    // Add special balls based on block types present
    if (blockTypes.has(BLOCK_WEAK))      pool.push(4); // Metal breaks weak
    if (blockTypes.has(BLOCK_FLAMMABLE)) pool.push(6); // Flame burns flammable
    if (blockTypes.has(BLOCK_STICKY))    pool.push(1); // Sticky clings to sticky blocks

    // Always add a couple random ball types for variety
    const extras = [...ALL_BALLS].filter(b => !pool.includes(b));
    fisherYates(extras, rand);
    const numExtras = 1 + Math.floor(rand() * 2);
    for (let i = 0; i < numExtras && i < extras.length; i++) {
        pool.push(extras[i]);
    }

    // Pick 3-5 balls from pool (with repetition for fairness)
    const ballCount = 3 + Math.floor(rand() * 3); // 3-5
    const result: number[] = [];
    for (let i = 0; i < ballCount; i++) {
        result.push(pool[Math.floor(rand() * pool.length)]);
    }
    return result;
}

/** In-place Fisher-Yates shuffle using the seeded RNG */
function fisherYates<T>(arr: T[], rand: () => number): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
