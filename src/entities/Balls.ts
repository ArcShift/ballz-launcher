interface Ball {
    name: string;
    description: string;
    imageIndex: number;
}

export const Ball: Ball[] = [
    { name: 'Normal', description: 'Just Normal Ball', imageIndex: 0 },
    { name: 'Sticky', description: 'Can stick on ceil platform', imageIndex: 1 },
    { name: 'Rubber', description: 'Can bounce higher', imageIndex: 2 },
    { name: 'Anti Gravity', description: 'Can fly to up', imageIndex: 3 },
    { name: 'Metal', description: 'Undestructible, can break weak platform', imageIndex: 4 },
    { name: 'Nitro', description: 'Move fast vertically until hit something', imageIndex: 5 },
    { name: 'Flame', description: 'Can burn flammable platform', imageIndex: 6 },
    { name: 'Matroshka', description: 'When pop, reveal smaller ball. until 3 times', imageIndex: 7 },
]