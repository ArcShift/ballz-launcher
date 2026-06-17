import { LevelData } from './Level';

export const PAGE9_LEVELS: Record<number, LevelData> = {
    73: {
        // Level 73: Phantom Zone
        balls: [3, 3, 1, 3, 5],
        launcher: { x: 150, y: 100 },
        portal: { x: 850, y: 650 },
        stars: [
            { x: 300, y: 300 },
            { x: 512, y: 450 },
            { x: 750, y: 300 }
        ],
        blocks: [
            // Phantom descent obstacles
            { x: 350, y: 250, type: 14 },
            { x: 500, y: 350, type: 11 },
            { x: 650, y: 250, type: 14 },
            { x: 400, y: 480, type: 12 },
            { x: 600, y: 480, type: 12 },
            { x: 512, y: 580, type: 13 }
        ],
        spikes: [
            { x: 280, y: 200 },
            { x: 760, y: 200 },
            { x: 512, y: 300 }
        ]
    },
    74: {
        // Level 74: Mega Split
        balls: [7, 7, 7, 7, 7, 4],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 650 },
        stars: [
            { x: 300, y: 400 },
            { x: 512, y: 300 },
            { x: 750, y: 400 }
        ],
        blocks: [
            // Many-block fortress
            { x: 450, y: 664, type: 11 },
            { x: 450, y: 600, type: 11 },
            { x: 450, y: 536, type: 11 },
            { x: 450, y: 472, type: 11 },
            { x: 450, y: 408, type: 11 },
            { x: 512, y: 408, type: 11 },
            { x: 574, y: 664, type: 11 },
            { x: 574, y: 600, type: 11 },
            { x: 574, y: 536, type: 11 },
            { x: 574, y: 472, type: 11 },
            { x: 574, y: 408, type: 11 }
        ],
        spikes: [
            { x: 280, y: 678 },
            { x: 700, y: 678 }
        ]
    },
    75: {
        // Level 75: Three-Quarter Mark
        balls: [4, 6, 3, 2, 1, 7],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 100 },
        stars: [
            { x: 250, y: 300 },
            { x: 512, y: 200 },
            { x: 800, y: 300 }
        ],
        blocks: [
            // Milestone challenge
            { x: 300, y: 550, type: 12 },
            { x: 300, y: 486, type: 13 },
            { x: 450, y: 420, type: 11 },
            { x: 600, y: 350, type: 14 },
            { x: 750, y: 280, type: 12 },
            { x: 850, y: 220, type: 11 }
        ],
        spikes: [
            { x: 370, y: 678 },
            { x: 530, y: 678 },
            { x: 690, y: 678 }
        ]
    },
    76: {
        // Level 76: Hellfire Pass
        balls: [6, 6, 6, 6, 4, 3],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 650 },
        stars: [
            { x: 300, y: 480 },
            { x: 512, y: 400 },
            { x: 750, y: 480 }
        ],
        blocks: [
            // Flammable corridor gauntlet
            { x: 350, y: 664, type: 13 },
            { x: 350, y: 600, type: 13 },
            { x: 350, y: 536, type: 13 },
            { x: 512, y: 664, type: 13 },
            { x: 512, y: 600, type: 13 },
            { x: 512, y: 536, type: 13 },
            { x: 700, y: 664, type: 13 },
            { x: 700, y: 600, type: 13 },
            { x: 700, y: 536, type: 13 }
        ],
        spikes: [
            { x: 230, y: 678 },
            { x: 820, y: 678 }
        ]
    },
    77: {
        // Level 77: The Spiral
        balls: [5, 2, 3, 1, 4],
        launcher: { x: 150, y: 650 },
        portal: { x: 512, y: 350 },
        stars: [
            { x: 300, y: 400 },
            { x: 600, y: 250 },
            { x: 400, y: 200 }
        ],
        blocks: [
            // Spiral path inward
            { x: 250, y: 450, type: 11 },
            { x: 350, y: 350, type: 11 },
            { x: 450, y: 280, type: 12 },
            { x: 600, y: 220, type: 12 },
            { x: 720, y: 300, type: 11 },
            { x: 780, y: 420, type: 13 }
        ],
        spikes: [
            { x: 320, y: 678 },
            { x: 720, y: 678 }
        ]
    },
    78: {
        // Level 78: Overdrive (All nitro)
        balls: [5, 5, 5, 5, 5, 5],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 250, y: 400 },
            { x: 512, y: 280 },
            { x: 800, y: 400 }
        ],
        blocks: [
            // Speed course
            { x: 280, y: 600, type: 11 },
            { x: 430, y: 520, type: 12 },
            { x: 580, y: 440, type: 13 },
            { x: 730, y: 360, type: 11 },
            { x: 880, y: 280, type: 12 },
            { x: 900, y: 200, type: 11 }
        ],
        spikes: [
            { x: 350, y: 678 },
            { x: 500, y: 678 },
            { x: 650, y: 678 },
            { x: 800, y: 678 }
        ]
    },
    79: {
        // Level 79: Reverse Engineering
        balls: [1, 4, 7, 6, 3, 2],
        launcher: { x: 900, y: 650 },
        portal: { x: 120, y: 650 },
        stars: [
            { x: 700, y: 450 },
            { x: 512, y: 350 },
            { x: 300, y: 450 }
        ],
        blocks: [
            // Reversed layout
            { x: 650, y: 600, type: 12 },
            { x: 650, y: 536, type: 13 },
            { x: 500, y: 500, type: 11 },
            { x: 350, y: 540, type: 14 },
            { x: 250, y: 600, type: 11 }
        ],
        spikes: [
            { x: 430, y: 678 },
            { x: 580, y: 678 }
        ]
    },
    80: {
        // Level 80: The Great Wall
        balls: [4, 4, 6, 4, 4, 7],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 650 },
        stars: [
            { x: 300, y: 350 },
            { x: 512, y: 300 },
            { x: 750, y: 350 }
        ],
        blocks: [
            // Great wall - multiple layers
            { x: 512, y: 664, type: 12 },
            { x: 512, y: 600, type: 12 },
            { x: 512, y: 536, type: 12 },
            { x: 512, y: 472, type: 12 },
            { x: 576, y: 664, type: 13 },
            { x: 576, y: 600, type: 13 },
            { x: 576, y: 536, type: 13 },
            { x: 576, y: 472, type: 13 },
            { x: 448, y: 380, type: 11 },
            { x: 512, y: 380, type: 11 },
            { x: 576, y: 380, type: 11 }
        ],
        spikes: [
            { x: 280, y: 678 },
            { x: 730, y: 678 }
        ]
    },
    81: {
        // Level 81: Page 9 Finale - Titan's Lair
        balls: [4, 6, 7, 3, 5, 1, 2, 4, 6],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 250, y: 300 },
            { x: 512, y: 180 },
            { x: 800, y: 300 }
        ],
        blocks: [
            // Titan lair - epic arrangement
            { x: 280, y: 664, type: 13 },
            { x: 280, y: 600, type: 13 },
            { x: 280, y: 536, type: 13 },
            { x: 450, y: 480, type: 12 },
            { x: 450, y: 416, type: 12 },
            { x: 600, y: 360, type: 11 },
            { x: 600, y: 296, type: 11 },
            { x: 760, y: 240, type: 14 },
            { x: 840, y: 180, type: 14 },
            { x: 920, y: 180, type: 14 }
        ],
        spikes: [
            { x: 370, y: 678 },
            { x: 540, y: 540 },
            { x: 690, y: 420 },
            { x: 850, y: 678 }
        ]
    }
};
