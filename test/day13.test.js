import { day13 as day } from '../src/index.js';

describe('Day 13', () => {
    const input = `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`.trim();

    test('part 1', () => {
        expect(day.part1(input)).toBe(13);
    });

    test('part 2', () => {
        expect(day.part2(input)).toBe(140);
    });
});
