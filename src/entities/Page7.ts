import { LevelData } from './Level';

export const PAGE7_LEVELS: Record<number, LevelData> = {
    55: {
        // Level 55: Bouncing Purgatory
        balls: [2, 2, 3, 2, 2],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 650 },
        stars: [
            { x: 280, y: 200 },
            { x: 512, y: 150 },
            { x: 770, y: 200 }
        ],
        blocks: [
            // Complex bounce maze
            { x: 280, y: 450, type: 11 },
            { x: 280, y: 386, type: 11 },
            { x: 420, y: 320, type: 11 },
            { x: 600, y: 320, type: 11 },
            { x: 770, y: 450, type: 11 },
            { x: 770, y: 386, type: 11 },
            { x: 512, y: 220, type: 12 }
        ],
        spikes: [
            { x: 350, y: 678 },
            { x: 512, y: 678 },
            { x: 680, y: 678 }
        ]
    },
    56: {
        // Level 56: Pyre Wall
        balls: [6, 6, 4, 6, 6],
        launcher: { x: 120, y: 650 },
        portal: { x: 900, y: 650 },
        stars: [
            { x: 350, y: 450 },
            { x: 512, y: 380 },
            { x: 700, y: 450 }
        ],
        blocks: [
            // Double flammable wall
            { x: 400, y: 664, type: 13 },
            { x: 400, y: 600, type: 13 },
            { x: 400, y: 536, type: 13 },
            { x: 400, y: 472, type: 13 },
            { x: 600, y: 664, type: 13 },
            { x: 600, y: 600, type: 13 },
            { x: 600, y: 536, type: 13 },
            { x: 600, y: 472, type: 13 }
        ],
        spikes: [
            { x: 250, y: 678 },
            { x: 800, y: 678 }
        ]
    },
    57: {
        // Level 57: Phase Shift
        balls: [3, 1, 5, 3, 1],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 120 },
        stars: [
            { x: 300, y: 200 },
            { x: 512, y: 180 },
            { x: 750, y: 200 }
        ],
        blocks: [
            // Alternating phases - sticky then standard
            { x: 300, y: 500, type: 14 },
            { x: 450, y: 400, type: 11 },
            { x: 600, y: 300, type: 14 },
            { x: 750, y: 200, type: 11 },
            // Floor barrier
            { x: 512, y: 664, type: 11 },
            { x: 512, y: 600, type: 11 }
        ],
        spikes: [
            { x: 370, y: 678 },
            { x: 650, y: 678 }
        ]
    },
    58: {
        // Level 58: Sector Seven
        balls: [7, 7, 4, 6, 7],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 350 },
        stars: [
            { x: 280, y: 380 },
            { x: 512, y: 280 },
            { x: 800, y: 380 }
        ],
        blocks: [
            // Seven obstacles
            { x: 250, y: 550, type: 12 },
            { x: 350, y: 480, type: 13 },
            { x: 450, y: 420, type: 11 },
            { x: 550, y: 380, type: 12 },
            { x: 650, y: 420, type: 13 },
            { x: 750, y: 480, type: 11 },
            { x: 860, y: 400, type: 14 }
        ],
        spikes: [
            { x: 300, y: 678 },
            { x: 512, y: 678 },
            { x: 720, y: 678 }
        ]
    },
    59: {
        // Level 59: Cascade Falls
        balls: [2, 3, 2, 4, 5],
        launcher: { x: 150, y: 200 },
        portal: { x: 850, y: 650 },
        stars: [
            { x: 300, y: 400 },
            { x: 512, y: 500 },
            { x: 750, y: 400 }
        ],
        blocks: [
            // Cascading platforms
            { x: 300, y: 350, type: 11 },
            { x: 450, y: 450, type: 11 },
            { x: 600, y: 550, type: 12 },
            { x: 750, y: 480, type: 11 },
            { x: 512, y: 620, type: 13 }
        ],
        spikes: [
            { x: 250, y: 300 },
            { x: 680, y: 400 }
        ]
    },
    60: {
        // Level 60: Diamond Formation
        balls: [4, 2, 1, 3, 6],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 650 },
        stars: [
            { x: 512, y: 180 },
            { x: 350, y: 380 },
            { x: 700, y: 380 }
        ],
        blocks: [
            // Diamond shape obstacle
            { x: 512, y: 220, type: 11 },
            { x: 380, y: 360, type: 11 },
            { x: 640, y: 360, type: 11 },
            { x: 512, y: 500, type: 12 },
            // Side spurs
            { x: 280, y: 500, type: 13 },
            { x: 760, y: 500, type: 13 }
        ],
        spikes: [
            { x: 400, y: 678 },
            { x: 650, y: 678 }
        ]
    },
    61: {
        // Level 61: Rapid Fire
        balls: [5, 6, 5, 4, 5],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 500 },
        stars: [
            { x: 300, y: 500 },
            { x: 550, y: 400 },
            { x: 800, y: 500 }
        ],
        blocks: [
            // Speed-required obstacles
            { x: 350, y: 580, type: 13 },
            { x: 500, y: 500, type: 12 },
            { x: 650, y: 540, type: 11 },
            { x: 800, y: 560, type: 14 },
            { x: 900, y: 550, type: 11 }
        ],
        spikes: [
            { x: 430, y: 678 },
            { x: 580, y: 678 },
            { x: 730, y: 678 }
        ]
    },
    62: {
        // Level 62: Inverse Tower
        balls: [3, 1, 4, 7, 2],
        launcher: { x: 150, y: 100 },
        portal: { x: 850, y: 650 },
        stars: [
            { x: 300, y: 500 },
            { x: 512, y: 600 },
            { x: 750, y: 500 }
        ],
        blocks: [
            // Inverted tower descending
            { x: 512, y: 200, type: 11 },
            { x: 512, y: 300, type: 12 },
            { x: 512, y: 400, type: 13 },
            { x: 400, y: 500, type: 11 },
            { x: 650, y: 500, type: 11 }
        ],
        spikes: [
            { x: 300, y: 300 },
            { x: 750, y: 300 }
        ]
    },
    63: {
        // Level 63: Page 7 Finale - Grand Explosion
        balls: [6, 4, 7, 3, 5, 1, 2, 0],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 250, y: 350 },
            { x: 512, y: 200 },
            { x: 800, y: 350 }
        ],
        blocks: [
            // Complex finale obstacles
            { x: 280, y: 664, type: 13 },
            { x: 280, y: 600, type: 13 },
            { x: 450, y: 500, type: 12 },
            { x: 450, y: 436, type: 12 },
            { x: 600, y: 400, type: 11 },
            { x: 600, y: 336, type: 11 },
            { x: 780, y: 300, type: 14 },
            { x: 860, y: 200, type: 14 }
        ],
        spikes: [
            { x: 370, y: 678 },
            { x: 540, y: 550 },
            { x: 700, y: 678 },
            { x: 880, y: 678 }
        ]
    }
};
