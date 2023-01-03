import { day6 as day } from '../src/index.js';

describe('Day 6', () => {
    test('part 1', () => {
        expect(day.part1('bvwbjplbgvbhsrlpgdmjqwftvncz')).toBe(5);
        expect(day.part1('nppdvjthqldpwncqszvftbrmjlhg')).toBe(6);
        expect(day.part1('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg')).toBe(10);
        expect(day.part1('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw')).toBe(11);
    });

    test('part 2', () => {
        expect(day.part2('mjqjpqmgbljsphdztnvjfqwrcgsmlb')).toBe(19);
        expect(day.part2('bvwbjplbgvbhsrlpgdmjqwftvncz')).toBe(23);
        expect(day.part2('nppdvjthqldpwncqszvftbrmjlhg')).toBe(23);
        expect(day.part2('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg')).toBe(29);
        expect(day.part2('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw')).toBe(26);
    });
});
