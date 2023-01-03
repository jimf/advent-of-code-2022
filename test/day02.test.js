import { day2 as day } from '../src/index.js';

describe('Day 2', () => {
    const input = `
A Y
B X
C Z
`.trim();

    test('part 1', () => {
        expect(day.part1(input)).toBe(15);
    });

    test('part 2', () => {
        expect(day.part2(input)).toBe(12);
    });
});
