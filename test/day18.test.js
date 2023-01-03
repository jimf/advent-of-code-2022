import { day18 as day } from '../src/index.js';

describe('Day 18', () => {
    const input = `
2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5
`.trim();

    test('part 1', () => {
        expect(day.part1(input)).toBe(64);
    });

    test.skip('part 2', () => {
        expect(day.part2(input)).toBe(58);
    });
});
