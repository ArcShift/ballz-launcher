import { PAGE1_LEVELS } from './Page1';
import { PAGE2_LEVELS } from './Page2';

export const LEVELS = { ...PAGE1_LEVELS, ...PAGE2_LEVELS };

export interface LevelData {
    balls: number[]; // Spritesheet frames: 0=Normal, 1=Sticky, 2=Rubber, 3=AntiGravity, 4=Metal, 5=Nitro, 6=Flame, 7=Matroshka
    blocks: { x: number; y: number; type: number }[]; // 11=Standard, 12=Weak, 13=Flammable, 14=Ceil/Sticky
    spikes: { x: number; y: number }[];
    stars: { x: number; y: number }[];
    launcher: { x: number; y: number };
    portal: { x: number; y: number };
}