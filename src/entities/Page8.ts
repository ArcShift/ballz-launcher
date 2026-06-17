import { LevelData } from './Level';

export const PAGE8_LEVELS: Record<number, LevelData> = {
    64: {
        // Level 64: The Labyrinth King
        balls: [1, 3, 1, 5, 1],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 120 },
        stars: [
            { x: 250, y: 300 },
            { x: 512, y: 200 },
            { x: 800, y: 300 }
        ],
        blocks: [
            // Dense labyrinth
            { x: 300, y: 500, type: 14 },
            { x: 300, y: 436, type: 11 },
            { x: 450, y: 380, type: 14 },
            { x: 600, y: 320, type: 11 },
            { x: 750, y: 260, type: 14 },
            // Blocking walls
            { x: 400, y: 664, type: 11 },
            { x: 600, y: 664, type: 11 },
            { x: 400, y: 600, type: 11 },
            { x: 600, y: 600, type: 11 }
        ],
        spikes: [
            { x: 512, y: 678 },
            { x: 820, y: 400 }
        ]
    },
    65: {
        // Level 65: Super Metal Strike
        balls: [4, 4, 4, 4, 4, 6],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 650 },
        stars: [
            { x: 300, y: 450 },
            { x: 512, y: 380 },
            { x: 750, y: 450 }
        ],
        blocks: [
            // Triple-thick weak wall
            { x: 450, y: 664, type: 12 },
            { x: 450, y: 600, type: 12 },
            { x: 450, y: 536, type: 12 },
            { x: 512, y: 664, type: 12 },
            { x: 512, y: 600, type: 12 },
            { x: 512, y: 536, type: 12 },
            { x: 574, y: 664, type: 12 },
            { x: 574, y: 600, type: 12 },
            { x: 574, y: 536, type: 12 },
            // Side standard walls
            { x: 300, y: 500, type: 11 },
            { x: 750, y: 500, type: 11 }
        ],
        spikes: [
            { x: 200, y: 678 },
            { x: 850, y: 678 }
        ]
    },
    66: {
        // Level 66: Quantum Leap
        balls: [3, 5, 3, 2, 3],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 100 },
        stars: [
            { x: 300, y: 200 },
            { x: 512, y: 150 },
            { x: 750, y: 200 }
        ],
        blocks: [
            // Quantum jumps - alternating gravity paths
            { x: 300, y: 160, type: 11 },
            { x: 400, y: 280, type: 11 },
            { x: 512, y: 200, type: 12 },
            { x: 650, y: 280, type: 11 },
            { x: 800, y: 160, type: 11 },
            // Floor obstacles
            { x: 350, y: 620, type: 11 },
            { x: 700, y: 620, type: 11 }
        ],
        spikes: [
            { x: 250, y: 678 },
            { x: 500, y: 678 },
            { x: 780, y: 678 }
        ]
    },
    67: {
        // Level 67: Nesting Ground
        balls: [7, 7, 7, 7, 4],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 650 },
        stars: [
            { x: 300, y: 300 },
            { x: 512, y: 200 },
            { x: 750, y: 300 }
        ],
        blocks: [
            // Nested box structure
            { x: 512, y: 150, type: 11 },
            { x: 350, y: 300, type: 11 },
            { x: 675, y: 300, type: 11 },
            { x: 512, y: 450, type: 12 },
            // Side chambers
            { x: 250, y: 500, type: 11 },
            { x: 800, y: 500, type: 11 },
            { x: 250, y: 436, type: 11 },
            { x: 800, y: 436, type: 11 }
        ],
        spikes: [
            { x: 400, y: 678 },
            { x: 650, y: 678 }
        ]
    },
    68: {
        // Level 68: Blazing Fortress
        balls: [6, 4, 6, 3, 6],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 250, y: 350 },
            { x: 512, y: 280 },
            { x: 800, y: 350 }
        ],
        blocks: [
            // Blazing fortress walls
            { x: 250, y: 664, type: 13 },
            { x: 250, y: 600, type: 13 },
            { x: 250, y: 536, type: 13 },
            { x: 800, y: 664, type: 13 },
            { x: 800, y: 600, type: 13 },
            { x: 800, y: 536, type: 13 },
            // Inner weak gate
            { x: 512, y: 500, type: 12 },
            { x: 512, y: 436, type: 12 },
            { x: 512, y: 372, type: 12 },
            // Top passage
            { x: 850, y: 200, type: 14 }
        ],
        spikes: [
            { x: 370, y: 678 },
            { x: 660, y: 678 }
        ]
    },
    69: {
        // Level 69: Precision Strike
        balls: [0, 4, 6, 1, 5],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 400 },
        stars: [
            { x: 300, y: 480 },
            { x: 512, y: 350 },
            { x: 750, y: 480 }
        ],
        blocks: [
            // Narrow precise targets
            { x: 380, y: 600, type: 12 },
            { x: 450, y: 480, type: 13 },
            { x: 550, y: 430, type: 12 },
            { x: 680, y: 480, type: 11 },
            { x: 800, y: 450, type: 14 }
        ],
        spikes: [
            { x: 300, y: 678 },
            { x: 512, y: 678 },
            { x: 730, y: 678 }
        ]
    },
    70: {
        // Level 70: Tower of Trials
        balls: [4, 3, 6, 1, 7, 5],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 100 },
        stars: [
            { x: 250, y: 300 },
            { x: 512, y: 200 },
            { x: 800, y: 300 }
        ],
        blocks: [
            // Multi-type tower floors
            { x: 400, y: 580, type: 12 },
            { x: 550, y: 580, type: 12 },
            { x: 350, y: 460, type: 13 },
            { x: 600, y: 460, type: 13 },
            { x: 400, y: 340, type: 11 },
            { x: 550, y: 340, type: 11 },
            { x: 450, y: 220, type: 14 },
            { x: 600, y: 220, type: 14 }
        ],
        spikes: [
            { x: 280, y: 678 },
            { x: 680, y: 678 }
        ]
    },
    71: {
        // Level 71: Magnetic Poles
        balls: [3, 3, 4, 3, 2],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 650 },
        stars: [
            { x: 300, y: 200 },
            { x: 512, y: 350 },
            { x: 750, y: 200 }
        ],
        blocks: [
            // North pole (ceiling)
            { x: 512, y: 120, type: 11 },
            { x: 400, y: 160, type: 11 },
            { x: 650, y: 160, type: 11 },
            // South pole (floor)
            { x: 400, y: 600, type: 12 },
            { x: 512, y: 600, type: 12 },
            { x: 650, y: 600, type: 12 },
            // Connector
            { x: 512, y: 380, type: 13 }
        ],
        spikes: [
            { x: 280, y: 678 },
            { x: 760, y: 678 }
        ]
    },
    72: {
        // Level 72: Page 8 Finale - The Sanctum
        balls: [4, 6, 3, 7, 1, 5, 2, 0],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 250, y: 300 },
            { x: 512, y: 180 },
            { x: 800, y: 300 }
        ],
        blocks: [
            // Sanctum walls
            { x: 250, y: 664, type: 13 },
            { x: 250, y: 600, type: 12 },
            { x: 400, y: 500, type: 11 },
            { x: 400, y: 436, type: 12 },
            { x: 560, y: 380, type: 13 },
            { x: 560, y: 316, type: 12 },
            { x: 720, y: 260, type: 14 },
            { x: 880, y: 200, type: 14 }
        ],
        spikes: [
            { x: 350, y: 678 },
            { x: 490, y: 550 },
            { x: 650, y: 440 },
            { x: 820, y: 678 }
        ]
    }
};
