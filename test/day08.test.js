import { day8 as day } from '../src/index.js';

describe('Day 8', () => {
    const input = `
30373
25512
65332
33549
35390
`.trim();

    test('part 1', () => {
        expect(day.part1(input)).toBe(21);
    });

    test('part 2', () => {
        expect(day.part2(input)).toBe(8);
    });
});
