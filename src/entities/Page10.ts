import { LevelData } from './Level';

export const PAGE10_LEVELS: Record<number, LevelData> = {
    82: {
        // Level 82: Master Class
        balls: [4, 6, 3, 7, 5, 1, 2],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 150 },
        stars: [
            { x: 280, y: 280 },
            { x: 512, y: 200 },
            { x: 780, y: 280 }
        ],
        blocks: [
            // Master-level arrangement
            { x: 300, y: 520, type: 13 },
            { x: 300, y: 456, type: 13 },
            { x: 450, y: 420, type: 12 },
            { x: 450, y: 356, type: 14 },
            { x: 612, y: 300, type: 11 },
            { x: 760, y: 240, type: 12 },
            { x: 860, y: 200, type: 14 }
        ],
        spikes: [
            { x: 380, y: 678 },
            { x: 540, y: 678 },
            { x: 700, y: 678 }
        ]
    },
    83: {
        // Level 83: Chromatic Scale
        balls: [0, 1, 2, 3, 4, 5],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 650 },
        stars: [
            { x: 300, y: 350 },
            { x: 512, y: 250 },
            { x: 750, y: 350 }
        ],
        blocks: [
            // Six-ball type challenge
            { x: 300, y: 580, type: 11 },
            { x: 400, y: 500, type: 12 },
            { x: 500, y: 430, type: 13 },
            { x: 600, y: 380, type: 14 },
            { x: 700, y: 430, type: 12 },
            { x: 800, y: 500, type: 11 }
        ],
        spikes: [
            { x: 350, y: 678 },
            { x: 550, y: 678 },
            { x: 750, y: 678 }
        ]
    },
    84: {
        // Level 84: Eclipse
        balls: [3, 6, 3, 4, 3, 1],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 100 },
        stars: [
            { x: 512, y: 150 },
            { x: 350, y: 350 },
            { x: 700, y: 350 }
        ],
        blocks: [
            // Eclipse pattern - ring around center
            { x: 512, y: 200, type: 14 },
            { x: 350, y: 300, type: 11 },
            { x: 700, y: 300, type: 11 },
            { x: 300, y: 450, type: 13 },
            { x: 750, y: 450, type: 13 },
            { x: 512, y: 520, type: 12 }
        ],
        spikes: [
            { x: 430, y: 678 },
            { x: 620, y: 678 }
        ]
    },
    85: {
        // Level 85: The Matrix
        balls: [7, 4, 6, 7, 3, 5],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 260, y: 350 },
            { x: 512, y: 250 },
            { x: 790, y: 350 }
        ],
        blocks: [
            // Grid matrix of obstacles
            { x: 300, y: 500, type: 12 },
            { x: 450, y: 500, type: 13 },
            { x: 600, y: 500, type: 12 },
            { x: 750, y: 500, type: 13 },
            { x: 300, y: 380, type: 13 },
            { x: 450, y: 380, type: 14 },
            { x: 600, y: 380, type: 13 },
            { x: 750, y: 380, type: 14 },
            { x: 380, y: 260, type: 12 },
            { x: 650, y: 260, type: 12 }
        ],
        spikes: [
            { x: 200, y: 678 },
            { x: 850, y: 678 }
        ]
    },
    86: {
        // Level 86: Phoenix Rising
        balls: [6, 6, 3, 6, 1, 5],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 80 },
        stars: [
            { x: 260, y: 200 },
            { x: 512, y: 150 },
            { x: 790, y: 200 }
        ],
        blocks: [
            // Rising phoenix pattern
            { x: 512, y: 600, type: 13 },
            { x: 400, y: 500, type: 13 },
            { x: 650, y: 500, type: 13 },
            { x: 320, y: 380, type: 11 },
            { x: 720, y: 380, type: 11 },
            { x: 512, y: 280, type: 14 },
            { x: 400, y: 200, type: 14 },
            { x: 650, y: 200, type: 14 }
        ],
        spikes: [
            { x: 300, y: 678 },
            { x: 730, y: 678 }
        ]
    },
    87: {
        // Level 87: Warp Zone
        balls: [3, 5, 3, 2, 3, 4],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 650 },
        stars: [
            { x: 300, y: 200 },
            { x: 512, y: 400 },
            { x: 750, y: 200 }
        ],
        blocks: [
            // Warped geometry
            { x: 300, y: 160, type: 14 },
            { x: 450, y: 280, type: 11 },
            { x: 600, y: 160, type: 14 },
            { x: 750, y: 280, type: 11 },
            { x: 400, y: 440, type: 12 },
            { x: 650, y: 440, type: 12 },
            { x: 512, y: 560, type: 13 }
        ],
        spikes: [
            { x: 350, y: 678 },
            { x: 680, y: 678 }
        ]
    },
    88: {
        // Level 88: Double Helix
        balls: [2, 1, 2, 4, 2, 7],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 150 },
        stars: [
            { x: 300, y: 300 },
            { x: 512, y: 200 },
            { x: 750, y: 300 }
        ],
        blocks: [
            // Helix pattern
            { x: 300, y: 540, type: 11 },
            { x: 400, y: 460, type: 12 },
            { x: 512, y: 380, type: 11 },
            { x: 650, y: 460, type: 12 },
            { x: 750, y: 540, type: 11 },
            { x: 400, y: 280, type: 14 },
            { x: 650, y: 280, type: 14 }
        ],
        spikes: [
            { x: 250, y: 678 },
            { x: 480, y: 678 },
            { x: 720, y: 678 }
        ]
    },
    89: {
        // Level 89: Penultimate Challenge
        balls: [4, 6, 7, 3, 5, 1, 2, 4],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 250, y: 320 },
            { x: 512, y: 200 },
            { x: 800, y: 320 }
        ],
        blocks: [
            // Near-final gauntlet
            { x: 280, y: 580, type: 12 },
            { x: 280, y: 516, type: 13 },
            { x: 430, y: 460, type: 11 },
            { x: 430, y: 396, type: 14 },
            { x: 580, y: 340, type: 12 },
            { x: 580, y: 276, type: 13 },
            { x: 730, y: 220, type: 11 },
            { x: 870, y: 180, type: 14 }
        ],
        spikes: [
            { x: 360, y: 678 },
            { x: 510, y: 540 },
            { x: 660, y: 420 },
            { x: 820, y: 678 }
        ]
    },
    90: {
        // Level 90: Page 10 Finale - Armageddon
        balls: [0, 1, 2, 3, 4, 5, 6, 7, 4],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 250, y: 300 },
            { x: 512, y: 180 },
            { x: 800, y: 300 }
        ],
        blocks: [
            // Ultimate pre-final challenge
            { x: 280, y: 664, type: 13 },
            { x: 280, y: 600, type: 12 },
            { x: 280, y: 536, type: 13 },
            { x: 430, y: 480, type: 11 },
            { x: 430, y: 416, type: 14 },
            { x: 580, y: 380, type: 12 },
            { x: 580, y: 316, type: 13 },
            { x: 730, y: 260, type: 14 },
            { x: 860, y: 200, type: 11 },
            { x: 920, y: 200, type: 11 }
        ],
        spikes: [
            { x: 360, y: 678 },
            { x: 510, y: 550 },
            { x: 660, y: 440 },
            { x: 810, y: 678 }
        ]
    }
};
