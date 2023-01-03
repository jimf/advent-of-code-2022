import { day4 as day } from '../src/index.js';

describe('Day 4', () => {
    const input = `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`.trim();

    test('part 1', () => {
        expect(day.part1(input)).toBe(2);
    });

    test('part 2', () => {
        expect(day.part2(input)).toBe(4);
    });
});
