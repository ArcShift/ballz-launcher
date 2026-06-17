import { LevelData } from './Level';

export const PAGE11_LEVELS: Record<number, LevelData> = {
    91: {
        // Level 91: The Legend Begins
        balls: [4, 6, 7, 3, 5, 1, 2, 4, 6],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 250, y: 350 },
            { x: 512, y: 220 },
            { x: 800, y: 350 }
        ],
        blocks: [
            { x: 280, y: 580, type: 12 },
            { x: 280, y: 516, type: 13 },
            { x: 280, y: 452, type: 14 },
            { x: 450, y: 420, type: 11 },
            { x: 600, y: 360, type: 12 },
            { x: 600, y: 296, type: 13 },
            { x: 760, y: 240, type: 14 },
            { x: 900, y: 190, type: 11 }
        ],
        spikes: [
            { x: 370, y: 678 },
            { x: 520, y: 550 },
            { x: 680, y: 420 },
            { x: 840, y: 678 }
        ]
    },
    92: {
        // Level 92: Hyper Drive
        balls: [5, 5, 5, 5, 5, 5, 5],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 260, y: 400 },
            { x: 512, y: 260 },
            { x: 800, y: 400 }
        ],
        blocks: [
            // All-nitro extreme speed run
            { x: 300, y: 580, type: 11 },
            { x: 420, y: 500, type: 12 },
            { x: 540, y: 420, type: 13 },
            { x: 660, y: 340, type: 11 },
            { x: 780, y: 260, type: 12 },
            { x: 880, y: 200, type: 11 },
            { x: 930, y: 160, type: 14 }
        ],
        spikes: [
            { x: 350, y: 678 },
            { x: 490, y: 678 },
            { x: 620, y: 678 },
            { x: 750, y: 678 }
        ]
    },
    93: {
        // Level 93: Infinity Loop
        balls: [3, 2, 3, 1, 3, 5, 3],
        launcher: { x: 150, y: 400 },
        portal: { x: 850, y: 400 },
        stars: [
            { x: 300, y: 200 },
            { x: 512, y: 350 },
            { x: 750, y: 200 }
        ],
        blocks: [
            // Figure-8 loop path
            { x: 300, y: 250, type: 14 },
            { x: 400, y: 170, type: 11 },
            { x: 300, y: 550, type: 11 },
            { x: 400, y: 640, type: 12 },
            { x: 700, y: 250, type: 14 },
            { x: 600, y: 170, type: 11 },
            { x: 700, y: 550, type: 11 },
            { x: 600, y: 640, type: 12 },
            { x: 512, y: 380, type: 13 }
        ],
        spikes: [
            { x: 200, y: 400 },
            { x: 850, y: 150 }
        ]
    },
    94: {
        // Level 94: Steel Rain
        balls: [4, 4, 4, 4, 4, 4, 4],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 650 },
        stars: [
            { x: 300, y: 350 },
            { x: 512, y: 250 },
            { x: 750, y: 350 }
        ],
        blocks: [
            // Rain of weak blocks
            { x: 300, y: 200, type: 12 },
            { x: 380, y: 280, type: 12 },
            { x: 460, y: 360, type: 12 },
            { x: 540, y: 440, type: 12 },
            { x: 620, y: 360, type: 12 },
            { x: 700, y: 280, type: 12 },
            { x: 780, y: 200, type: 12 },
            // Central wall
            { x: 512, y: 580, type: 11 },
            { x: 512, y: 640, type: 11 }
        ],
        spikes: [
            { x: 250, y: 678 },
            { x: 800, y: 678 }
        ]
    },
    95: {
        // Level 95: Infernal Machine
        balls: [6, 4, 7, 6, 3, 6, 4],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 250, y: 280 },
            { x: 512, y: 180 },
            { x: 800, y: 280 }
        ],
        blocks: [
            // Machine gears - circular obstacles
            { x: 300, y: 500, type: 13 },
            { x: 300, y: 436, type: 13 },
            { x: 430, y: 400, type: 12 },
            { x: 512, y: 360, type: 11 },
            { x: 600, y: 400, type: 12 },
            { x: 720, y: 436, type: 13 },
            { x: 720, y: 372, type: 13 },
            { x: 600, y: 260, type: 14 },
            { x: 860, y: 200, type: 14 }
        ],
        spikes: [
            { x: 200, y: 678 },
            { x: 400, y: 570 },
            { x: 650, y: 570 },
            { x: 850, y: 678 }
        ]
    },
    96: {
        // Level 96: Shadow World
        balls: [3, 1, 3, 7, 3, 5, 3],
        launcher: { x: 100, y: 100 },
        portal: { x: 950, y: 650 },
        stars: [
            { x: 300, y: 400 },
            { x: 512, y: 550 },
            { x: 750, y: 400 }
        ],
        blocks: [
            // Shadow world - inverted obstacles
            { x: 350, y: 250, type: 14 },
            { x: 500, y: 180, type: 14 },
            { x: 650, y: 250, type: 14 },
            { x: 400, y: 420, type: 12 },
            { x: 550, y: 480, type: 13 },
            { x: 700, y: 540, type: 11 }
        ],
        spikes: [
            { x: 250, y: 200 },
            { x: 800, y: 200 },
            { x: 512, y: 350 }
        ]
    },
    97: {
        // Level 97: The Storm
        balls: [6, 5, 4, 3, 2, 1, 7, 6],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 250, y: 300 },
            { x: 512, y: 200 },
            { x: 800, y: 300 }
        ],
        blocks: [
            // Storm pattern - chaotic but solvable
            { x: 280, y: 550, type: 13 },
            { x: 380, y: 470, type: 12 },
            { x: 480, y: 420, type: 14 },
            { x: 570, y: 370, type: 13 },
            { x: 660, y: 320, type: 12 },
            { x: 760, y: 270, type: 11 },
            { x: 860, y: 220, type: 14 }
        ],
        spikes: [
            { x: 360, y: 678 },
            { x: 500, y: 550 },
            { x: 640, y: 450 },
            { x: 780, y: 678 }
        ]
    },
    98: {
        // Level 98: Omega Point
        balls: [4, 6, 7, 3, 5, 1, 2, 4, 6],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 250, y: 280 },
            { x: 512, y: 180 },
            { x: 800, y: 280 }
        ],
        blocks: [
            // Near-final boss gauntlet
            { x: 270, y: 600, type: 12 },
            { x: 270, y: 536, type: 13 },
            { x: 420, y: 460, type: 14 },
            { x: 420, y: 396, type: 11 },
            { x: 570, y: 340, type: 12 },
            { x: 570, y: 276, type: 13 },
            { x: 720, y: 220, type: 14 },
            { x: 860, y: 180, type: 11 },
            { x: 920, y: 180, type: 14 }
        ],
        spikes: [
            { x: 360, y: 678 },
            { x: 500, y: 560 },
            { x: 640, y: 450 },
            { x: 790, y: 340 }
        ]
    },
    99: {
        // Level 99: THE FINAL LEVEL - Absolute Zero
        balls: [0, 1, 2, 3, 4, 5, 6, 7, 4, 6],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 250, y: 250 },
            { x: 512, y: 160 },
            { x: 800, y: 250 }
        ],
        blocks: [
            // THE FINAL CHALLENGE
            { x: 270, y: 664, type: 13 },
            { x: 270, y: 600, type: 12 },
            { x: 270, y: 536, type: 13 },
            { x: 400, y: 480, type: 14 },
            { x: 400, y: 416, type: 11 },
            { x: 530, y: 380, type: 12 },
            { x: 530, y: 316, type: 13 },
            { x: 660, y: 260, type: 14 },
            { x: 660, y: 196, type: 11 },
            { x: 800, y: 200, type: 12 },
            { x: 870, y: 160, type: 14 },
            { x: 930, y: 160, type: 11 }
        ],
        spikes: [
            { x: 350, y: 678 },
            { x: 470, y: 560 },
            { x: 600, y: 450 },
            { x: 730, y: 340 },
            { x: 860, y: 678 }
        ]
    }
};
