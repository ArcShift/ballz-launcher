import { PAGE1_LEVELS } from './Page1';
import { PAGE2_LEVELS } from './Page2';
import { PAGE3_LEVELS } from './Page3';
import { PAGE4_LEVELS } from './Page4';
import { PAGE5_LEVELS } from './Page5';
import { PAGE6_LEVELS } from './Page6';
import { PAGE7_LEVELS } from './Page7';
import { PAGE8_LEVELS } from './Page8';
import { PAGE9_LEVELS } from './Page9';
import { PAGE10_LEVELS } from './Page10';
import { PAGE11_LEVELS } from './Page11';

export const LEVELS = {
    ...PAGE1_LEVELS,
    ...PAGE2_LEVELS,
    ...PAGE3_LEVELS,
    ...PAGE4_LEVELS,
    ...PAGE5_LEVELS,
    ...PAGE6_LEVELS,
    ...PAGE7_LEVELS,
    ...PAGE8_LEVELS,
    ...PAGE9_LEVELS,
    ...PAGE10_LEVELS,
    ...PAGE11_LEVELS,
};

export interface LevelData {
    balls: number[]; // Spritesheet frames: 0=Normal, 1=Sticky, 2=Rubber, 3=AntiGravity, 4=Metal, 5=Nitro, 6=Flame, 7=Matroshka
    blocks: { x: number; y: number; type: number }[]; // 11=Standard, 12=Weak, 13=Flammable, 14=Ceil/Sticky
    spikes: { x: number; y: number }[];
    stars: { x: number; y: number }[];
    launcher: { x: number; y: number };
    portal: { x: number; y: number };
}