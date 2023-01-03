import { day17 as day } from '../src/index.js';

describe('Day 17', () => {
    const input = '>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>';

    test('part 1', () => {
        expect(day.part1(input)).toBe(3068);
    });

    test('part 2', () => {
        expect(day.part2(input)).toBe(1514285714288);
    });
});
