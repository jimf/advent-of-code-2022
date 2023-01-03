import defaultInput from './input.js';

const intersect = (a, b) => {
    const result = new Set();

    for (const member of b) {
        if (a.has(member)) {
            result.add(member);
        }
    }

    return result;
};

export const part1 = (input = defaultInput) => {
    let sum = 0;

    for (const rucksack of input.split('\n')) {
        const mid = rucksack.length / 2;
        const compartment1 = new Set(rucksack.slice(0, mid).split(''));
        const common = rucksack.slice(mid).split('').find(c => compartment1.has(c));
        const charCode = common.charCodeAt(0);
        const priority = charCode >= 97 ? (charCode - 96) : (charCode - 38);
        sum += priority;
    }

    return sum;
};

export const part2 = (input = defaultInput) => {
    const lines = input.split('\n');
    let sum = 0;

    for (let idx = 0; idx < lines.length; idx += 3) {
        const [common] = [
            new Set(lines[idx].split('')),
            new Set(lines[idx + 1].split('')),
            new Set(lines[idx + 2].split('')),
        ].reduce(intersect);
        const charCode = common.charCodeAt(0);
        const priority = charCode >= 97 ? (charCode - 96) : (charCode - 38);
        sum += priority;
    }

    return sum;
};
