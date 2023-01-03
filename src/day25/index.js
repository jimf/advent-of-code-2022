import defaultInput from './input.js';

const parseSnafu = snafu => {
    const symbols = {
        '2': 2,
        '1': 1,
        '0': 0,
        '-': -1,
        '=': -2,
    };

    let pow = 1;
    let total = 0;

    for (let i = snafu.length -1; i >= 0; i -= 1) {
        const c = snafu.charAt(i);
        const value = pow * symbols[c];
        total += value;
        pow *= 5;
    }

    return total;
};

const toSnafu = n => {
    const symbols = ['0', '1', '2', '=', '-'];
    const result = [];

    while (n > 0) {
        let quotient = Math.floor(n / 5);
        const remainder = n % 5;
        result.unshift(symbols[remainder]);

        if (remainder > 2) {
            quotient += 1;
        }

        n = quotient;
    }

    return result.join('');
};

export const part1 = (input = defaultInput) => {
    const sum = input.split('\n').reduce((acc, snafu) => acc + parseSnafu(snafu), 0);
    return toSnafu(sum);
};

export const part2 = (input = defaultInput) => {
};
