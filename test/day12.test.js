import { day12 as day } from '../src/index.js';

describe('Day 12', () => {
    const input = `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`.trim();

    test('part 1', () => {
        expect(day.part1(input)).toBe(31);
    });

    test('part 2', () => {
        expect(day.part2(input)).toBe(29);
    });
});
