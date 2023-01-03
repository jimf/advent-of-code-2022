import defaultInput from './input.js';

// We use a wrapper class to get around the fact that the puzzle input contains
// duplicates. Since the instances won't be strictly equal, this gives us the
// ability to leverage Array#indexOf to get the correct number every time.
//
// NOTE: This could probably be achieved without a special class by calling the
// Number constructor with `new`, but a very quick refactor to try it left me
// with failing tests and I didn't try to persue further. Probably my own error.
class Int {
    constructor(value) {
        this.value = value;
    }
}

const mix = (numbers, n = 1) => {
    const result = [...numbers];

    while (n > 0) {
        for (const number of numbers) {
            const resultIdx = result.indexOf(number);
            result.splice(resultIdx, 1);
            let nextIdx = (resultIdx + number.value) % result.length;

            if (nextIdx < 0) {
                nextIdx += result.length;
            }

            result.splice(nextIdx, 0, number);
        }

        n -= 1;
    }

    return result;
};

export const part1 = (input = defaultInput) => {
    const original = input.split('\n').map(num => new Int(Number(num)));
    const mixed = mix(original);
    const zeroIdx = mixed.findIndex(num => num.value === 0);
    return [1000, 2000, 3000]
        .map(shift => mixed[(zeroIdx + shift) % mixed.length])
        .reduce((acc, num) => acc + num.value, 0);
};

export const part2 = (input = defaultInput) => {
    const decryptionKey = 811589153;
    const original = input.split('\n').map(num => new Int(Number(num) * decryptionKey));
    const mixed = mix(original, 10);
    const zeroIdx = mixed.findIndex(num => num.value === 0);
    return [1000, 2000, 3000]
        .map(shift => mixed[(zeroIdx + shift) % mixed.length])
        .reduce((acc, num) => acc + num.value, 0);
};
