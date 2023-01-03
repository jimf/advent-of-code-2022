import { day25 as day } from '../src/index.js';

describe('Day 25', () => {
    const input = `
1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122
`.trim();

    test('part 1', () => {
        expect(day.part1(input)).toBe('2=-1=0');
    });

    test('part 2', () => {
        // expect(day.part2(input)).toBe(20);
    });
});
