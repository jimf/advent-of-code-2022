import { day24 as day } from '../src/index.js';

describe.skip('Day 24', () => {
    const input = `
#.#####
#.....#
#>....#
#.....#
#...v.#
#.....#
#####.#
`.trim();

    test('part 1', () => {
        expect(day.part1(input)).toBe(18);
    });

    test('part 2', () => {
        // expect(day.part2(input)).toBe(20);
    });
});
