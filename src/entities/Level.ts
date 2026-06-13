export interface LevelData {
    balls: number[]; // Spritesheet frames: 0=Normal, 1=Sticky, 2=Rubber, 3=AntiGravity, 4=Metal, 5=Nitro, 6=Flame, 7=Matroshka
    blocks: { x: number; y: number; type: number }[]; // 11=Standard, 12=Weak, 13=Flammable, 14=Ceil/Sticky
    spikes: { x: number; y: number }[];
    stars: { x: number; y: number }[];
    launcher: { x: number; y: number };
    portal: { x: number; y: number };
}

export const LEVELS: Record<number, LevelData> = {
    1: {
        // Level 1: Launch Practice
        balls: [0, 0, 0],
        launcher: { x: 150, y: 580 },
        portal: { x: 850, y: 580 },
        stars: [
            { x: 400, y: 450 },
            { x: 500, y: 400 },
            { x: 600, y: 450 }
        ],
        blocks: [
            { x: 500, y: 600, type: 11 } // Standard brick in the middle
        ],
        spikes: []
    },
    2: {
        // Level 2: Bouncing High (Rubber Ball)
        balls: [2, 2, 2],
        launcher: { x: 150, y: 600 },
        portal: { x: 880, y: 600 },
        stars: [
            { x: 512, y: 180 },
            { x: 380, y: 350 },
            { x: 640, y: 350 }
        ],
        blocks: [
            // Tall dividing wall
            { x: 512, y: 650, type: 11 },
            { x: 512, y: 586, type: 11 },
            { x: 512, y: 522, type: 11 },
            { x: 512, y: 458, type: 11 },
            // Ceiling to bounce off
            { x: 380, y: 250, type: 11 },
            { x: 640, y: 250, type: 11 }
        ],
        spikes: [
            { x: 512, y: 394 } // Spikes on top of the divider wall
        ]
    },
    3: {
        // Level 3: Sticky Ceilings (Sticky Ball)
        balls: [1, 1, 1],
        launcher: { x: 120, y: 650 },
        portal: { x: 900, y: 220 },
        stars: [
            { x: 400, y: 200 },
            { x: 600, y: 200 },
            { x: 750, y: 200 }
        ],
        blocks: [
            // Ceil platform on the ceiling
            { x: 300, y: 300, type: 14 },
            { x: 500, y: 300, type: 14 },
            { x: 700, y: 300, type: 14 },
            // Barriers
            { x: 450, y: 550, type: 11 },
            { x: 450, y: 614, type: 11 },
            { x: 450, y: 678, type: 11 }
        ],
        spikes: [
            { x: 600, y: 678 }
        ]
    },
    4: {
        // Level 4: Gravity Flip (Anti Gravity Ball)
        balls: [3, 3, 3],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 180 },
        stars: [
            { x: 320, y: 150 },
            { x: 512, y: 150 },
            { x: 700, y: 150 }
        ],
        blocks: [
            // Ceiling separating floor and top
            { x: 350, y: 380, type: 11 },
            { x: 414, y: 380, type: 11 },
            { x: 478, y: 380, type: 11 },
            { x: 542, y: 380, type: 11 },
            { x: 606, y: 380, type: 11 },
            { x: 670, y: 380, type: 11 }
        ],
        spikes: [
            // Spikes on the floor
            { x: 400, y: 678 },
            { x: 464, y: 678 },
            { x: 528, y: 678 },
            { x: 592, y: 678 }
        ]
    },
    5: {
        // Level 5: Heavy Metal Crumble (Metal Ball)
        balls: [4, 4, 4],
        launcher: { x: 150, y: 600 },
        portal: { x: 880, y: 600 },
        stars: [
            { x: 512, y: 600 },
            { x: 512, y: 536 },
            { x: 512, y: 472 }
        ],
        blocks: [
            // Weak blocks wall blocking the portal
            { x: 512, y: 664, type: 12 },
            { x: 512, y: 600, type: 12 },
            { x: 512, y: 536, type: 12 },
            { x: 512, y: 472, type: 12 }
        ],
        spikes: []
    },
    6: {
        // Level 6: Flaming Fuel (Flame Ball)
        balls: [6, 6, 6],
        launcher: { x: 150, y: 600 },
        portal: { x: 880, y: 600 },
        stars: [
            { x: 480, y: 580 },
            { x: 544, y: 580 },
            { x: 608, y: 580 }
        ],
        blocks: [
            // Flammable wall
            { x: 544, y: 664, type: 13 },
            { x: 544, y: 600, type: 13 },
            { x: 544, y: 536, type: 13 }
        ],
        spikes: [
            { x: 350, y: 678 }
        ]
    },
    7: {
        // Level 7: Matryoshka Split (Matroshka Ball)
        balls: [7, 7, 7],
        launcher: { x: 150, y: 600 },
        portal: { x: 900, y: 600 },
        stars: [
            { x: 550, y: 350 },
            { x: 550, y: 470 },
            { x: 550, y: 590 }
        ],
        blocks: [
            // Wall with 3 separate small horizontal tunnels
            { x: 550, y: 250, type: 11 },
            { x: 550, y: 410, type: 11 },
            { x: 550, y: 530, type: 11 },
            { x: 550, y: 690, type: 11 }
        ],
        spikes: []
    },
    8: {
        // Level 8: Nitro Dash (Nitro Ball)
        balls: [5, 5, 5],
        launcher: { x: 120, y: 650 },
        portal: { x: 920, y: 350 },
        stars: [
            { x: 450, y: 450 },
            { x: 650, y: 380 },
            { x: 800, y: 350 }
        ],
        blocks: [
            // Obstacles requiring direct air speed
            { x: 550, y: 500, type: 11 },
            { x: 550, y: 564, type: 11 },
            { x: 550, y: 628, type: 11 }
        ],
        spikes: [
            // Large spike pit
            { x: 300, y: 678 },
            { x: 364, y: 678 },
            { x: 428, y: 678 },
            { x: 492, y: 678 },
            { x: 608, y: 678 },
            { x: 672, y: 678 },
            { x: 736, y: 678 },
            { x: 800, y: 678 }
        ]
    },
    9: {
        // Level 9: The Grand Finale (Strategy mix!)
        balls: [4, 6, 1, 0],
        launcher: { x: 120, y: 650 },
        portal: { x: 920, y: 650 },
        stars: [
            { x: 350, y: 480 },
            { x: 600, y: 420 },
            { x: 750, y: 220 }
        ],
        blocks: [
            // 1. Weak blocks wall
            { x: 350, y: 664, type: 12 },
            { x: 350, y: 600, type: 12 },
            // 2. Flammable wall
            { x: 600, y: 664, type: 13 },
            { x: 600, y: 600, type: 13 },
            // 3. Tall wall with Sticky platform on ceiling
            { x: 800, y: 664, type: 11 },
            { x: 800, y: 600, type: 11 },
            { x: 800, y: 536, type: 11 },
            { x: 800, y: 472, type: 11 },
            { x: 800, y: 300, type: 14 } // sticky roof
        ],
        spikes: [
            { x: 475, y: 678 },
            { x: 700, y: 678 }
        ]
    }
};