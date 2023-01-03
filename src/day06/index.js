import defaultInput from './input.js';

export const part1 = (input = defaultInput) => {
    let [a, b, c, d] = input.split('');
    let idx = 3;
    const isStartOfPacket = () => new Set([a, b, c, d]).size === 4;

    while (!isStartOfPacket() && idx < input.length) {
        idx += 1;
        a = b;
        b = c;
        c = d;
        d = input.charAt(idx);
    }

    return idx + 1;
};

export const part2 = (input = defaultInput) => {
    let idx = 13;
    const isStartOfMessage = () => new Set(input.slice(idx - 13, idx + 1).split('')).size === 14;

    while (!isStartOfMessage() && idx < input.length) {
        idx += 1;
    }

    return idx + 1;
};
