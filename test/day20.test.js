import { day20 as day } from '../src/index.js';

describe('Day 20', () => {
    const input = `
1
2
-3
3
-2
0
4
`.trim();

    test('part 1', () => {
        expect(day.part1(input)).toBe(3);
    });

    test('part 2', () => {
        expect(day.part2(input)).toBe(1623178306);
    });
});
