import { LevelData } from './Level';

export const PAGE4_LEVELS: Record<number, LevelData> = {
    28: {
        // Level 28: Double Bounce
        balls: [2, 2, 2, 4],
        launcher: { x: 120, y: 650 },
        portal: { x: 900, y: 150 },
        stars: [
            { x: 300, y: 400 },
            { x: 512, y: 250 },
            { x: 750, y: 400 }
        ],
        blocks: [
            // Bounce pads (ceiling blocks to bounce off)
            { x: 300, y: 350, type: 11 },
            { x: 512, y: 250, type: 11 },
            { x: 750, y: 350, type: 11 },
            // Barrier walls
            { x: 400, y: 664, type: 12 },
            { x: 400, y: 600, type: 12 }
        ],
        spikes: [
            { x: 500, y: 678 },
            { x: 650, y: 678 }
        ]
    },
    29: {
        // Level 29: Inferno Corridor
        balls: [6, 6, 6, 5],
        launcher: { x: 100, y: 600 },
        portal: { x: 940, y: 600 },
        stars: [
            { x: 350, y: 550 },
            { x: 512, y: 480 },
            { x: 700, y: 550 }
        ],
        blocks: [
            // Flammable corridor walls
            { x: 400, y: 664, type: 13 },
            { x: 400, y: 600, type: 13 },
            { x: 400, y: 536, type: 13 },
            { x: 600, y: 664, type: 13 },
            { x: 600, y: 600, type: 13 },
            { x: 600, y: 536, type: 13 }
        ],
        spikes: [
            { x: 250, y: 678 },
            { x: 800, y: 678 }
        ]
    },
    30: {
        // Level 30: Gravity Tunnel
        balls: [3, 3, 3, 2],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 80 },
        stars: [
            { x: 200, y: 150 },
            { x: 512, y: 150 },
            { x: 800, y: 150 }
        ],
        blocks: [
            // Ceiling tunnel for anti-grav path
            { x: 300, y: 130, type: 11 },
            { x: 400, y: 130, type: 11 },
            { x: 600, y: 130, type: 11 },
            { x: 700, y: 130, type: 11 },
            // Floor obstacles
            { x: 400, y: 664, type: 11 },
            { x: 600, y: 664, type: 11 },
            { x: 400, y: 600, type: 11 },
            { x: 600, y: 600, type: 11 }
        ],
        spikes: [
            { x: 350, y: 540 },
            { x: 550, y: 540 },
            { x: 750, y: 540 }
        ]
    },
    31: {
        // Level 31: Splinter Cell (Matryoshka precision)
        balls: [7, 7, 7, 0],
        launcher: { x: 120, y: 650 },
        portal: { x: 900, y: 650 },
        stars: [
            { x: 300, y: 480 },
            { x: 512, y: 350 },
            { x: 750, y: 480 }
        ],
        blocks: [
            // Dense wall of standard blocks
            { x: 512, y: 664, type: 11 },
            { x: 512, y: 600, type: 11 },
            { x: 512, y: 536, type: 11 },
            { x: 512, y: 472, type: 11 },
            { x: 512, y: 408, type: 11 },
            // Side chambers
            { x: 350, y: 400, type: 11 },
            { x: 700, y: 400, type: 11 }
        ],
        spikes: [
            { x: 250, y: 678 },
            { x: 400, y: 678 },
            { x: 650, y: 678 },
            { x: 820, y: 678 }
        ]
    },
    32: {
        // Level 32: Speed Slope
        balls: [5, 5, 3, 2],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 250, y: 550 },
            { x: 500, y: 380 },
            { x: 800, y: 200 }
        ],
        blocks: [
            // Diagonal step platforms
            { x: 280, y: 600, type: 11 },
            { x: 420, y: 480, type: 11 },
            { x: 560, y: 360, type: 11 },
            { x: 700, y: 240, type: 12 },
            { x: 860, y: 160, type: 12 }
        ],
        spikes: [
            { x: 350, y: 678 },
            { x: 490, y: 678 },
            { x: 630, y: 678 },
            { x: 770, y: 678 }
        ]
    },
    33: {
        // Level 33: The Sticky Web
        balls: [1, 1, 7, 3],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 120 },
        stars: [
            { x: 300, y: 200 },
            { x: 512, y: 180 },
            { x: 750, y: 200 }
        ],
        blocks: [
            // Sticky web across ceiling
            { x: 250, y: 170, type: 14 },
            { x: 350, y: 170, type: 14 },
            { x: 450, y: 170, type: 14 },
            { x: 600, y: 170, type: 14 },
            { x: 700, y: 170, type: 14 },
            // Mid obstacles
            { x: 400, y: 430, type: 11 },
            { x: 650, y: 380, type: 11 }
        ],
        spikes: [
            { x: 300, y: 678 },
            { x: 520, y: 678 },
            { x: 750, y: 678 }
        ]
    },
    34: {
        // Level 34: Flame and Metal
        balls: [4, 6, 4, 6],
        launcher: { x: 120, y: 650 },
        portal: { x: 900, y: 300 },
        stars: [
            { x: 350, y: 400 },
            { x: 512, y: 300 },
            { x: 700, y: 400 }
        ],
        blocks: [
            // Alternating weak and flammable blocks
            { x: 380, y: 664, type: 12 },
            { x: 380, y: 600, type: 13 },
            { x: 380, y: 536, type: 12 },
            { x: 650, y: 664, type: 13 },
            { x: 650, y: 600, type: 12 },
            { x: 650, y: 536, type: 13 },
            // Top platform
            { x: 800, y: 350, type: 11 }
        ],
        spikes: [
            { x: 250, y: 678 },
            { x: 780, y: 678 }
        ]
    },
    35: {
        // Level 35: Suspended Stars
        balls: [0, 2, 3, 1],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 600 },
        stars: [
            { x: 300, y: 300 },
            { x: 512, y: 200 },
            { x: 750, y: 300 }
        ],
        blocks: [
            // Floating platforms holding stars
            { x: 300, y: 340, type: 11 },
            { x: 512, y: 240, type: 11 },
            { x: 750, y: 340, type: 11 },
            // Portal side wall
            { x: 780, y: 664, type: 11 },
            { x: 780, y: 600, type: 11 }
        ],
        spikes: [
            { x: 400, y: 678 },
            { x: 620, y: 678 }
        ]
    },
    36: {
        // Level 36: Page 4 Finale - Elemental Storm
        balls: [3, 6, 4, 7, 5, 1],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 250, y: 400 },
            { x: 512, y: 220 },
            { x: 800, y: 400 }
        ],
        blocks: [
            // Left section - flame burst
            { x: 280, y: 664, type: 13 },
            { x: 280, y: 600, type: 13 },
            // Middle - anti-grav + metal smash
            { x: 512, y: 480, type: 12 },
            { x: 512, y: 416, type: 12 },
            // Right tower with sticky roof
            { x: 800, y: 664, type: 11 },
            { x: 800, y: 600, type: 11 },
            { x: 800, y: 536, type: 11 },
            { x: 800, y: 200, type: 14 },
            { x: 880, y: 200, type: 14 }
        ],
        spikes: [
            { x: 380, y: 678 },
            { x: 620, y: 678 },
            { x: 880, y: 678 }
        ]
    }
};
