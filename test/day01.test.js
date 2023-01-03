import { day1 as day } from '../src/index.js';

describe('Day 1', () => {
    const input = `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
`.trim();

    test('part 1', () => {
        expect(day.part1(input)).toBe(24000);
    });

    test('part 2', () => {
        expect(day.part2(input)).toBe(45000);
    });
});
