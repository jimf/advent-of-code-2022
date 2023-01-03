import defaultInput from './input.js';

export const part1 = (input = defaultInput) => {
    const caloriesPerElf = [0];
    let max = -Infinity;

    for (const line of input.split('\n')) {
        if (line) {
            caloriesPerElf[caloriesPerElf.length - 1] += parseInt(line, 10);
        } else {
            max = Math.max(max, caloriesPerElf.at(-1));
            caloriesPerElf.push(0);
        }
    }

    return Math.max(max, caloriesPerElf.at(-1));
};

export const part2 = (input = defaultInput) => {
    const caloriesPerElf = [0];

    for (const line of input.split('\n')) {
        if (line) {
            caloriesPerElf[caloriesPerElf.length - 1] += parseInt(line, 10);
        } else {
            caloriesPerElf.push(0);
        }
    }

    caloriesPerElf.sort((a, b) => a - b);
    return caloriesPerElf.slice(-3).reduce((x, y) => x + y, 0);
};
