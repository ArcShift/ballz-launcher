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
    },
    10: {
        // Level 10: Twin Towers (Page 2 - Challenge increases!)
        balls: [2, 3, 4],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 300, y: 300 },
            { x: 512, y: 200 },
            { x: 750, y: 350 }
        ],
        blocks: [
            // Left tower
            { x: 300, y: 664, type: 11 },
            { x: 300, y: 600, type: 11 },
            { x: 300, y: 536, type: 11 },
            { x: 300, y: 472, type: 11 },
            // Right tower
            { x: 750, y: 664, type: 11 },
            { x: 750, y: 600, type: 11 },
            { x: 750, y: 536, type: 11 },
            { x: 750, y: 472, type: 11 },
            // Bridge
            { x: 450, y: 380, type: 11 },
            { x: 512, y: 380, type: 11 }
        ],
        spikes: [
            { x: 200, y: 678 },
            { x: 850, y: 678 }
        ]
    },
    11: {
        // Level 11: Fiery Path (Mixed abilities)
        balls: [6, 1, 5],
        launcher: { x: 120, y: 600 },
        portal: { x: 900, y: 300 },
        stars: [
            { x: 350, y: 450 },
            { x: 512, y: 350 },
            { x: 700, y: 500 }
        ],
        blocks: [
            // Flammable wall blocking path
            { x: 400, y: 664, type: 13 },
            { x: 400, y: 600, type: 13 },
            { x: 400, y: 536, type: 13 },
            // Standard platform
            { x: 512, y: 420, type: 11 },
            // Weak blocks at exit
            { x: 800, y: 400, type: 12 },
            { x: 800, y: 336, type: 12 }
        ],
        spikes: [
            { x: 250, y: 678 },
            { x: 550, y: 678 }
        ]
    },
    12: {
        // Level 12: Gravity Maze (Advanced anti-gravity)
        balls: [3, 3, 2],
        launcher: { x: 150, y: 650 },
        portal: { x: 850, y: 100 },
        stars: [
            { x: 200, y: 300 },
            { x: 512, y: 250 },
            { x: 800, y: 400 }
        ],
        blocks: [
            // Floor section
            { x: 300, y: 664, type: 11 },
            { x: 450, y: 664, type: 11 },
            // Mid-air platforms
            { x: 400, y: 400, type: 11 },
            { x: 600, y: 350, type: 11 },
            { x: 800, y: 300, type: 11 },
            // Ceiling section
            { x: 700, y: 150, type: 11 }
        ],
        spikes: [
            { x: 550, y: 450 },
            { x: 700, y: 500 }
        ]
    },
    13: {
        // Level 13: Split & Scatter (Matryoshka challenge)
        balls: [7, 4, 0],
        launcher: { x: 150, y: 600 },
        portal: { x: 900, y: 600 },
        stars: [
            { x: 350, y: 400 },
            { x: 512, y: 300 },
            { x: 700, y: 400 }
        ],
        blocks: [
            // Central wall to split around
            { x: 512, y: 664, type: 11 },
            { x: 512, y: 600, type: 11 },
            { x: 512, y: 536, type: 11 },
            // Side obstacles
            { x: 300, y: 400, type: 12 },
            { x: 750, y: 400, type: 13 }
        ],
        spikes: [
            { x: 300, y: 678 },
            { x: 400, y: 678 },
            { x: 650, y: 678 },
            { x: 750, y: 678 }
        ]
    },
    14: {
        // Level 14: The Sticky Escape
        balls: [1, 1, 6],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 150 },
        stars: [
            { x: 250, y: 400 },
            { x: 512, y: 200 },
            { x: 850, y: 350 }
        ],
        blocks: [
            // Sticky ceiling path
            { x: 250, y: 250, type: 14 },
            { x: 350, y: 250, type: 14 },
            { x: 450, y: 250, type: 14 },
            // Mid platforms
            { x: 600, y: 350, type: 11 },
            { x: 750, y: 300, type: 11 },
            // Exit barriers
            { x: 850, y: 450, type: 13 }
        ],
        spikes: [
            { x: 550, y: 300 },
            { x: 550, y: 680 }
        ]
    },
    15: {
        // Level 15: Nitro Gauntlet (Speed challenge)
        balls: [5, 5, 4],
        launcher: { x: 120, y: 600 },
        portal: { x: 900, y: 500 },
        stars: [
            { x: 300, y: 500 },
            { x: 550, y: 350 },
            { x: 800, y: 400 }
        ],
        blocks: [
            // Obstacle course
            { x: 350, y: 600, type: 11 },
            { x: 450, y: 550, type: 11 },
            { x: 550, y: 500, type: 11 },
            { x: 700, y: 450, type: 12 },
            // Finish line
            { x: 850, y: 600, type: 11 }
        ],
        spikes: [
            { x: 250, y: 678 },
            { x: 400, y: 678 },
            { x: 600, y: 678 },
            { x: 800, y: 678 }
        ]
    },
    16: {
        // Level 16: Mixed Mastery
        balls: [3, 6, 7, 2],
        launcher: { x: 150, y: 650 },
        portal: { x: 900, y: 200 },
        stars: [
            { x: 300, y: 350 },
            { x: 600, y: 280 },
            { x: 850, y: 400 }
        ],
        blocks: [
            // Left section: weak wall
            { x: 300, y: 664, type: 12 },
            { x: 300, y: 600, type: 12 },
            // Middle: flammable
            { x: 512, y: 500, type: 13 },
            // Right: sticky platform
            { x: 750, y: 300, type: 14 },
            // Top exit
            { x: 850, y: 250, type: 11 }
        ],
        spikes: [
            { x: 400, y: 678 },
            { x: 550, y: 550 },
            { x: 700, y: 678 }
        ]
    },
    17: {
        // Level 17: The Fortress
        balls: [4, 4, 6, 1],
        launcher: { x: 100, y: 650 },
        portal: { x: 950, y: 100 },
        stars: [
            { x: 200, y: 400 },
            { x: 512, y: 250 },
            { x: 850, y: 350 }
        ],
        blocks: [
            // Outer walls
            { x: 200, y: 664, type: 11 },
            { x: 200, y: 600, type: 11 },
            { x: 950, y: 664, type: 11 },
            { x: 950, y: 600, type: 11 },
            // Inner fortress - weak wall to break through
            { x: 512, y: 600, type: 12 },
            { x: 512, y: 536, type: 12 },
            { x: 512, y: 472, type: 12 },
            // Flammable interior
            { x: 600, y: 400, type: 13 },
            { x: 400, y: 400, type: 13 }
        ],
        spikes: [
            { x: 300, y: 678 },
            { x: 700, y: 678 }
        ]
    },
    18: {
        // Level 18: Endgame - Ultimate Challenge (Page 2 finale)
        balls: [4, 6, 3, 7, 5, 1],
        launcher: { x: 120, y: 650 },
        portal: { x: 920, y: 100 },
        stars: [
            { x: 250, y: 300 },
            { x: 550, y: 200 },
            { x: 850, y: 350 }
        ],
        blocks: [
            // Left gate - weak blocks
            { x: 250, y: 664, type: 12 },
            { x: 250, y: 600, type: 12 },
            // Central path - flammable
            { x: 400, y: 550, type: 13 },
            { x: 500, y: 500, type: 13 },
            { x: 600, y: 450, type: 13 },
            // Right tower - standard
            { x: 800, y: 664, type: 11 },
            { x: 800, y: 600, type: 11 },
            { x: 800, y: 536, type: 11 },
            // Top passage - sticky platform
            { x: 700, y: 200, type: 14 },
            { x: 800, y: 200, type: 14 }
        ],
        spikes: [
            { x: 300, y: 678 },
            { x: 450, y: 600 },
            { x: 650, y: 550 },
            { x: 850, y: 678 }
        ]
    }
};
