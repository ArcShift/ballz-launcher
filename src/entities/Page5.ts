import { LevelData } from './Level';

export const PAGE5_LEVELS: Record<number, LevelData> = {
    37: {
        // Level 37: Mirror Maze
        balls: [2, 3, 2, 3],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 650 },
        stars: [
            { x: 350, y: 300 },
            { x: 512, y: 200 },
            { x: 700, y: 300 }
        ],
        blocks: [
            // Symmetrical maze
            { x: 300, y: 500, type: 11 },
            { x: 300, y: 436, type: 11 },
            { x: 750, y: 500, type: 11 },
            { x: 750, y: 436, type: 11 },
            { x: 420, y: 300, type: 11 },
            { x: 620, y: 300, type: 11 },
            { x: 512, y: 200, type: 12 }
        ],
        spikes: [
            { x: 400, y: 678 },
            { x: 512, y: 678 },
            { x: 650, y: 678 }
        ]
    },
    38: {
        // Level 38: The Forge (Metal-heavy)
        balls: [4, 4, 4, 4, 6],
        launcher: { x: 120, y: 650 },
        portal: { x: 900, y: 650 },
        stars: [
            { x: 350, y: 480 },
            { x: 512, y: 380 },
            { x: 700, y: 480 }
        ],
        blocks: [
            // Thick weak-block fortress
            { x: 450, y: 664, type: 12 },
            { x: 450, y: 600, type: 12 },
            { x: 450, y: 536, type: 12 },
            { x: 512, y: 664, type: 12 },
            { x: 512, y: 600, type: 12 },
            { x: 512, y: 536, type: 12 },
            { x: 574, y: 664, type: 12 },
            { x: 574, y: 600, type: 12 },
            { x: 574, y: 536, type: 12 }
        ],
        spikes: [
            { x: 300, y: 678 },
            { x: 700, y: 678 }
        ]
    },
    39: {
        // Level 39: Wind Tunnel (Nitro race)
        balls: [5, 5, 5, 5],
        launcher: { x: 100, y: 400 },
        portal: { x: 950, y: 400 },
        stars: [
            { x: 300, y: 400 },
            { x: 512, y: 350 },
            { x: 750, y: 400 }
        ],
        blocks: [
            // Tunnel walls
            { x: 300, y: 320, type: 11 },
            { x: 450, y: 280, type: 11 },
            { x: 600, y: 320, type: 11 },
            { x: 750, y: 280, type: 11 },
            { x: 300, y: 480, type: 11 },
            { x: 450, y: 520, type: 11 },
            { x: 600, y: 480, type: 11 },
            { x: 750, y: 520, type: 11 }
        ],
        spikes: [
            { x: 512, y: 200 },
            { x: 512, y: 600 }
        ]
    },
    40: {
        // Level 40: Sticky Ascent
        balls: [1, 1, 1, 1, 3],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 80 },
        stars: [
            { x: 200, y: 180 },
            { x: 512, y: 150 },
            { x: 820, y: 180 }
        ],
        blocks: [
            // Ascending sticky platforms
            { x: 280, y: 550, type: 14 },
            { x: 420, y: 440, type: 14 },
            { x: 560, y: 330, type: 14 },
            { x: 700, y: 220, type: 14 },
            // Wall obstacles
            { x: 500, y: 664, type: 11 },
            { x: 500, y: 600, type: 11 }
        ],
        spikes: [
            { x: 350, y: 678 },
            { x: 650, y: 678 }
        ]
    },
    41: {
        // Level 41: Fragile Ground
        balls: [0, 4, 2, 0],
        launcher: { x: 150, y: 600 },
        portal: { x: 850, y: 600 },
        stars: [
            { x: 300, y: 500 },
            { x: 512, y: 400 },
            { x: 750, y: 500 }
        ],
        blocks: [
            // Weak floor bridges
            { x: 350, y: 640, type: 12 },
            { x: 420, y: 640, type: 12 },
            { x: 490, y: 640, type: 12 },
            { x: 560, y: 640, type: 12 },
            { x: 630, y: 640, type: 12 },
            // Side platforms
            { x: 300, y: 500, type: 11 },
            { x: 750, y: 500, type: 11 }
        ],
        spikes: [
            { x: 200, y: 678 },
            { x: 820, y: 678 }
        ]
    },
    42: {
        // Level 42: Three-Ring Circus
        balls: [7, 6, 4, 1, 3],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 200 },
        stars: [
            { x: 280, y: 350 },
            { x: 512, y: 300 },
            { x: 780, y: 350 }
        ],
        blocks: [
            // Ring 1 - flammable
            { x: 280, y: 500, type: 13 },
            { x: 280, y: 436, type: 13 },
            // Ring 2 - weak
            { x: 512, y: 430, type: 12 },
            { x: 512, y: 366, type: 12 },
            // Ring 3 - sticky ceiling
            { x: 780, y: 300, type: 14 },
            { x: 840, y: 300, type: 14 },
            // Top exit
            { x: 900, y: 250, type: 11 }
        ],
        spikes: [
            { x: 380, y: 678 },
            { x: 650, y: 678 }
        ]
    },
    43: {
        // Level 43: Gravity Pendulum
        balls: [3, 3, 2, 5],
        launcher: { x: 150, y: 600 },
        portal: { x: 850, y: 600 },
        stars: [
            { x: 300, y: 200 },
            { x: 512, y: 150 },
            { x: 750, y: 200 }
        ],
        blocks: [
            // Pendulum obstacles ceiling
            { x: 300, y: 160, type: 11 },
            { x: 512, y: 140, type: 11 },
            { x: 750, y: 160, type: 11 },
            // Floor obstacles
            { x: 400, y: 664, type: 11 },
            { x: 650, y: 664, type: 11 },
            // Mid-wall
            { x: 512, y: 400, type: 12 },
            { x: 512, y: 464, type: 12 }
        ],
        spikes: [
            { x: 250, y: 560 },
            { x: 790, y: 560 }
        ]
    },
    44: {
        // Level 44: Nitro Storm
        balls: [5, 5, 6, 4, 5],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 400 },
        stars: [
            { x: 300, y: 500 },
            { x: 600, y: 350 },
            { x: 850, y: 450 }
        ],
        blocks: [
            // Obstacle course with mixed types
            { x: 350, y: 600, type: 11 },
            { x: 500, y: 500, type: 13 },
            { x: 650, y: 420, type: 12 },
            { x: 800, y: 480, type: 11 },
            { x: 900, y: 450, type: 12 }
        ],
        spikes: [
            { x: 250, y: 678 },
            { x: 430, y: 678 },
            { x: 580, y: 678 },
            { x: 730, y: 678 }
        ]
    },
    45: {
        // Level 45: Page 5 Finale - Volcano Core
        balls: [6, 4, 3, 7, 5, 1, 2],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 250, y: 300 },
            { x: 512, y: 200 },
            { x: 800, y: 300 }
        ],
        blocks: [
            // Volcano-shaped arrangement
            { x: 300, y: 664, type: 13 },
            { x: 300, y: 600, type: 13 },
            { x: 400, y: 500, type: 12 },
            { x: 512, y: 400, type: 12 },
            { x: 600, y: 500, type: 13 },
            { x: 700, y: 664, type: 13 },
            { x: 700, y: 600, type: 13 },
            // Sticky top exit
            { x: 840, y: 180, type: 14 },
            { x: 920, y: 180, type: 14 }
        ],
        spikes: [
            { x: 380, y: 678 },
            { x: 512, y: 450 },
            { x: 820, y: 678 }
        ]
    }
};
