import { day3 as day } from '../src/index.js';

describe('Day 3', () => {
    const input = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`.trim();

    test('part 1', () => {
        expect(day.part1(input)).toBe(157);
    });

    test('part 2', () => {
        expect(day.part2(input)).toBe(70);
    });
});
