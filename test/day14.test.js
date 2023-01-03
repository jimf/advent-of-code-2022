import { day14 as day } from '../src/index.js';

describe('Day 14', () => {
    const input = `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`.trim();

    test('part 1', () => {
        expect(day.part1(input)).toBe(24);
    });

    test('part 2', () => {
        expect(day.part2(input)).toBe(93);
    });
});
