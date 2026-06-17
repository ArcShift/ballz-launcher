import { LevelData } from './Level';

export const PAGE6_LEVELS: Record<number, LevelData> = {
    46: {
        // Level 46: The Descent (Anti-grav mastery)
        balls: [3, 3, 3, 5, 2],
        launcher: { x: 150, y: 150 },
        portal: { x: 850, y: 650 },
        stars: [
            { x: 300, y: 500 },
            { x: 512, y: 380 },
            { x: 750, y: 500 }
        ],
        blocks: [
            // Downward path obstacles (using gravity flip)
            { x: 400, y: 300, type: 11 },
            { x: 600, y: 250, type: 11 },
            { x: 350, y: 450, type: 12 },
            { x: 650, y: 400, type: 12 },
            { x: 512, y: 550, type: 13 }
        ],
        spikes: [
            { x: 300, y: 200 },
            { x: 700, y: 200 }
        ]
    },
    47: {
        // Level 47: Scatter Bomb
        balls: [7, 7, 6, 4, 7],
        launcher: { x: 120, y: 650 },
        portal: { x: 900, y: 300 },
        stars: [
            { x: 300, y: 450 },
            { x: 512, y: 350 },
            { x: 750, y: 450 }
        ],
        blocks: [
            // Multiple split points
            { x: 350, y: 600, type: 11 },
            { x: 350, y: 536, type: 11 },
            { x: 512, y: 500, type: 11 },
            { x: 512, y: 436, type: 11 },
            { x: 700, y: 600, type: 12 },
            { x: 700, y: 536, type: 12 },
            // Top exit
            { x: 850, y: 350, type: 11 }
        ],
        spikes: [
            { x: 230, y: 678 },
            { x: 450, y: 678 },
            { x: 620, y: 678 },
            { x: 820, y: 678 }
        ]
    },
    48: {
        // Level 48: Ice Cavern (Rubber + Metal)
        balls: [2, 4, 2, 4, 2],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 650 },
        stars: [
            { x: 300, y: 350 },
            { x: 512, y: 250 },
            { x: 750, y: 350 }
        ],
        blocks: [
            // Cavern structures
            { x: 300, y: 400, type: 11 },
            { x: 300, y: 336, type: 11 },
            { x: 450, y: 300, type: 12 },
            { x: 600, y: 300, type: 12 },
            { x: 750, y: 400, type: 11 },
            { x: 750, y: 336, type: 11 },
            // Central pillar
            { x: 512, y: 600, type: 11 },
            { x: 512, y: 664, type: 11 }
        ],
        spikes: [
            { x: 380, y: 678 },
            { x: 660, y: 678 }
        ]
    },
    49: {
        // Level 49: Sticky Web v2
        balls: [1, 1, 7, 1, 3],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 120 },
        stars: [
            { x: 250, y: 200 },
            { x: 512, y: 150 },
            { x: 800, y: 200 }
        ],
        blocks: [
            // Complex sticky web
            { x: 200, y: 200, type: 14 },
            { x: 300, y: 200, type: 14 },
            { x: 450, y: 180, type: 14 },
            { x: 600, y: 180, type: 14 },
            { x: 750, y: 200, type: 14 },
            { x: 900, y: 180, type: 14 },
            // Floor wall
            { x: 400, y: 664, type: 11 },
            { x: 400, y: 600, type: 11 },
            { x: 650, y: 664, type: 11 },
            { x: 650, y: 600, type: 11 }
        ],
        spikes: [
            { x: 512, y: 678 }
        ]
    },
    50: {
        // Level 50: Golden Milestone
        balls: [0, 1, 2, 3, 4, 5, 6, 7],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 250, y: 400 },
            { x: 512, y: 300 },
            { x: 800, y: 400 }
        ],
        blocks: [
            // Gated with all block types
            { x: 300, y: 600, type: 12 },
            { x: 300, y: 536, type: 12 },
            { x: 450, y: 500, type: 13 },
            { x: 450, y: 436, type: 13 },
            { x: 600, y: 400, type: 14 },
            { x: 750, y: 350, type: 11 },
            { x: 750, y: 286, type: 11 }
        ],
        spikes: [
            { x: 370, y: 678 },
            { x: 520, y: 678 },
            { x: 680, y: 678 },
            { x: 840, y: 678 }
        ]
    },
    51: {
        // Level 51: The Gauntlet Returns
        balls: [5, 4, 6, 3, 2],
        launcher: { x: 120, y: 650 },
        portal: { x: 900, y: 200 },
        stars: [
            { x: 300, y: 450 },
            { x: 512, y: 300 },
            { x: 750, y: 450 }
        ],
        blocks: [
            // Gauntlet lane
            { x: 350, y: 600, type: 11 },
            { x: 350, y: 536, type: 11 },
            { x: 512, y: 450, type: 13 },
            { x: 512, y: 386, type: 13 },
            { x: 700, y: 350, type: 12 },
            { x: 700, y: 286, type: 12 },
            // Exit block
            { x: 860, y: 250, type: 11 }
        ],
        spikes: [
            { x: 250, y: 678 },
            { x: 450, y: 678 },
            { x: 620, y: 678 }
        ]
    },
    52: {
        // Level 52: Dual Chambers
        balls: [4, 1, 6, 3],
        launcher: { x: 120, y: 650 },
        portal: { x: 900, y: 650 },
        stars: [
            { x: 300, y: 400 },
            { x: 512, y: 300 },
            { x: 750, y: 400 }
        ],
        blocks: [
            // Left chamber
            { x: 250, y: 550, type: 12 },
            { x: 380, y: 550, type: 12 },
            { x: 250, y: 486, type: 12 },
            { x: 380, y: 486, type: 12 },
            // Right chamber
            { x: 680, y: 550, type: 13 },
            { x: 810, y: 550, type: 13 },
            { x: 680, y: 486, type: 13 },
            { x: 810, y: 486, type: 13 },
            // Bridge
            { x: 512, y: 420, type: 14 }
        ],
        spikes: [
            { x: 512, y: 678 }
        ]
    },
    53: {
        // Level 53: Rubber Reef
        balls: [2, 2, 2, 2, 4],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 300 },
        stars: [
            { x: 300, y: 400 },
            { x: 512, y: 250 },
            { x: 750, y: 400 }
        ],
        blocks: [
            // Reef-like bounce obstacles
            { x: 300, y: 450, type: 11 },
            { x: 400, y: 380, type: 11 },
            { x: 512, y: 300, type: 12 },
            { x: 650, y: 380, type: 11 },
            { x: 750, y: 450, type: 11 }
        ],
        spikes: [
            { x: 350, y: 678 },
            { x: 512, y: 678 },
            { x: 700, y: 678 }
        ]
    },
    54: {
        // Level 54: Page 6 Finale - The Abyss
        balls: [3, 6, 4, 7, 1, 5, 2],
        launcher: { x: 100, y: 100 },
        portal: { x: 950, y: 650 },
        stars: [
            { x: 250, y: 600 },
            { x: 512, y: 400 },
            { x: 800, y: 600 }
        ],
        blocks: [
            // Abyss descent obstacles
            { x: 300, y: 300, type: 13 },
            { x: 300, y: 236, type: 13 },
            { x: 512, y: 350, type: 12 },
            { x: 512, y: 414, type: 12 },
            { x: 750, y: 500, type: 11 },
            { x: 750, y: 436, type: 11 },
            { x: 900, y: 550, type: 14 }
        ],
        spikes: [
            { x: 200, y: 200 },
            { x: 650, y: 300 },
            { x: 400, y: 450 }
        ]
    }
};
