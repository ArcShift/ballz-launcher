import { LevelData } from './Level';

export const PAGE3_LEVELS: Record<number, LevelData> = {
    19: {
        // Level 19: Rubber Gauntlet
        balls: [2, 2, 4],
        launcher: { x: 120, y: 650 },
        portal: { x: 900, y: 650 },
        stars: [
            { x: 300, y: 500 },
            { x: 512, y: 400 },
            { x: 750, y: 500 }
        ],
        blocks: [
            // Bouncy obstacle course
            { x: 350, y: 664, type: 11 },
            { x: 350, y: 600, type: 11 },
            { x: 500, y: 450, type: 11 },
            { x: 700, y: 664, type: 12 },
            { x: 700, y: 600, type: 12 }
        ],
        spikes: [
            { x: 450, y: 678 },
            { x: 580, y: 678 }
        ]
    },
    20: {
        // Level 20: Flame Ceiling
        balls: [6, 6, 1],
        launcher: { x: 150, y: 650 },
        portal: { x: 880, y: 150 },
        stars: [
            { x: 300, y: 150 },
            { x: 512, y: 150 },
            { x: 750, y: 150 }
        ],
        blocks: [
            // Flammable ceiling barrier
            { x: 300, y: 200, type: 13 },
            { x: 400, y: 200, type: 13 },
            { x: 500, y: 200, type: 13 },
            { x: 600, y: 200, type: 13 },
            // Sticky platform to reach
            { x: 400, y: 350, type: 14 },
            { x: 600, y: 350, type: 14 }
        ],
        spikes: [
            { x: 300, y: 678 },
            { x: 700, y: 678 }
        ]
    },
    21: {
        // Level 21: Steel Vault
        balls: [4, 4, 4, 6],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 650 },
        stars: [
            { x: 400, y: 450 },
            { x: 512, y: 350 },
            { x: 700, y: 450 }
        ],
        blocks: [
            // Thick weak wall vault
            { x: 512, y: 664, type: 12 },
            { x: 512, y: 600, type: 12 },
            { x: 512, y: 536, type: 12 },
            { x: 576, y: 664, type: 12 },
            { x: 576, y: 600, type: 12 },
            { x: 576, y: 536, type: 12 },
            // Outer walls
            { x: 250, y: 500, type: 11 },
            { x: 800, y: 500, type: 11 }
        ],
        spikes: [
            { x: 350, y: 678 },
            { x: 700, y: 678 }
        ]
    },
    22: {
        // Level 22: Anti-Grav Canyon
        balls: [3, 3, 5],
        launcher: { x: 150, y: 600 },
        portal: { x: 850, y: 100 },
        stars: [
            { x: 250, y: 200 },
            { x: 512, y: 300 },
            { x: 800, y: 200 }
        ],
        blocks: [
            // Canyon walls
            { x: 350, y: 664, type: 11 },
            { x: 350, y: 600, type: 11 },
            { x: 350, y: 536, type: 11 },
            { x: 350, y: 472, type: 11 },
            { x: 700, y: 664, type: 11 },
            { x: 700, y: 600, type: 11 },
            { x: 700, y: 536, type: 11 },
            // Ceiling obstacles
            { x: 450, y: 180, type: 11 },
            { x: 600, y: 180, type: 11 }
        ],
        spikes: [
            { x: 450, y: 678 },
            { x: 550, y: 678 },
            { x: 650, y: 678 }
        ]
    },
    23: {
        // Level 23: Matryoshka Mayhem
        balls: [7, 7, 4, 2],
        launcher: { x: 120, y: 650 },
        portal: { x: 920, y: 400 },
        stars: [
            { x: 350, y: 350 },
            { x: 550, y: 250 },
            { x: 750, y: 350 }
        ],
        blocks: [
            // Split-required barriers
            { x: 400, y: 500, type: 11 },
            { x: 400, y: 436, type: 11 },
            { x: 650, y: 500, type: 11 },
            { x: 650, y: 436, type: 11 },
            // Ceiling
            { x: 500, y: 300, type: 11 },
            { x: 550, y: 300, type: 11 }
        ],
        spikes: [
            { x: 300, y: 678 },
            { x: 520, y: 678 },
            { x: 780, y: 678 }
        ]
    },
    24: {
        // Level 24: Nitro Parkour
        balls: [5, 5, 5, 3],
        launcher: { x: 100, y: 650 },
        portal: { x: 960, y: 200 },
        stars: [
            { x: 300, y: 550 },
            { x: 550, y: 400 },
            { x: 800, y: 250 }
        ],
        blocks: [
            // Step-up platforms
            { x: 300, y: 600, type: 11 },
            { x: 450, y: 500, type: 11 },
            { x: 600, y: 400, type: 11 },
            { x: 750, y: 300, type: 11 },
            { x: 900, y: 250, type: 12 }
        ],
        spikes: [
            { x: 370, y: 678 },
            { x: 520, y: 678 },
            { x: 670, y: 678 },
            { x: 820, y: 678 }
        ]
    },
    25: {
        // Level 25: Sticky Labyrinth
        balls: [1, 1, 1, 6],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 100 },
        stars: [
            { x: 300, y: 300 },
            { x: 512, y: 200 },
            { x: 750, y: 350 }
        ],
        blocks: [
            // Labyrinth walls
            { x: 300, y: 500, type: 11 },
            { x: 300, y: 436, type: 11 },
            { x: 300, y: 372, type: 11 },
            { x: 550, y: 400, type: 11 },
            { x: 550, y: 336, type: 11 },
            // Sticky platforms above
            { x: 400, y: 250, type: 14 },
            { x: 650, y: 200, type: 14 },
            // Flammable exit
            { x: 800, y: 200, type: 13 }
        ],
        spikes: [
            { x: 430, y: 678 },
            { x: 680, y: 678 }
        ]
    },
    26: {
        // Level 26: Twin Flame Towers
        balls: [6, 3, 4, 1],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 280, y: 250 },
            { x: 512, y: 350 },
            { x: 780, y: 250 }
        ],
        blocks: [
            // Left flame tower
            { x: 280, y: 664, type: 13 },
            { x: 280, y: 600, type: 13 },
            { x: 280, y: 536, type: 13 },
            { x: 280, y: 472, type: 13 },
            // Right flame tower
            { x: 780, y: 664, type: 13 },
            { x: 780, y: 600, type: 13 },
            { x: 780, y: 536, type: 13 },
            { x: 780, y: 472, type: 13 },
            // Bridge platform
            { x: 512, y: 380, type: 11 },
            // Sticky ceiling
            { x: 500, y: 180, type: 14 }
        ],
        spikes: [
            { x: 400, y: 678 },
            { x: 650, y: 678 }
        ]
    },
    27: {
        // Level 27: Page 3 Finale - Chaos Chamber
        balls: [4, 6, 3, 7, 1, 5],
        launcher: { x: 100, y: 650 },
        portal: { x: 940, y: 100 },
        stars: [
            { x: 250, y: 350 },
            { x: 512, y: 200 },
            { x: 800, y: 350 }
        ],
        blocks: [
            // Left weak wall
            { x: 280, y: 664, type: 12 },
            { x: 280, y: 600, type: 12 },
            // Flammable mid section
            { x: 450, y: 550, type: 13 },
            { x: 550, y: 500, type: 13 },
            // Anti-grav corridor
            { x: 700, y: 450, type: 11 },
            { x: 700, y: 386, type: 11 },
            // Sticky ceiling exit
            { x: 800, y: 200, type: 14 },
            { x: 880, y: 200, type: 14 }
        ],
        spikes: [
            { x: 370, y: 678 },
            { x: 620, y: 678 },
            { x: 820, y: 678 }
        ]
    }
};