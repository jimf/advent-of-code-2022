import { day9 as day } from '../src/index.js';

describe('Day 9', () => {
    const input = `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`.trim();

    const largerInput = `
R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`.trim();

    test('part 1', () => {
        expect(day.part1(input)).toBe(13);
    });

    test('part 2', () => {
        expect(day.part2(largerInput)).toBe(36);
    });
});
