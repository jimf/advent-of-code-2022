import { day23 as day } from '../src/index.js';

describe('Day 23', () => {
    const input = `
....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..
`.trim();

    test('part 1', () => {
        expect(day.part1(input)).toBe(110);
    });

    test('part 2', () => {
        expect(day.part2(input)).toBe(20);
    });
});
