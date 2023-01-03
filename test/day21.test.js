import { day21 as day } from '../src/index.js';

describe('Day 21', () => {
    const input = `
root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
`.trim();

    test('part 1', () => {
        expect(day.part1(input)).toBe(152);
    });

    test('part 2', () => {
        expect(day.part2(input)).toBe(301);
    });
});
