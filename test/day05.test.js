import { day5 as day } from '../src/index.js';

describe('Day 5', () => {
    const input = `
    [D]
[N] [C]
[Z] [M] [P]
 1   2   3

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`.replace(/(^\n)|(\n$)/, '');

    test('part 1', () => {
        expect(day.part1(input)).toBe('CMZ');
    });

    test('part 2', () => {
        expect(day.part2(input)).toBe('MCD');
    });
});
