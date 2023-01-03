import { day22 as day } from '../src/index.js';

describe('Day 22', () => {
    const input = `
        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5
`.slice(1, -1);

    test('part 1', () => {
        expect(day.part1(input)).toBe(6032);
    });

    test.skip('part 2', () => {
        expect(day.part2(input, 4)).toBe(5031);
    });
});
