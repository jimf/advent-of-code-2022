import defaultInput from './input.js';

export const part1 = (input = defaultInput) => {
    let sum = 0;
    const pattern = /[^\d]/g;

    for (const line of input.split('\n')) {
        const [fstStart, fstEnd, sndStart, sndEnd] = line.split(pattern).map(n => parseInt(n, 10));

        if ((fstStart >= sndStart && fstEnd <= sndEnd) || (sndStart >= fstStart && sndEnd <= fstEnd)) {
            sum += 1;
        }
    }

    return sum;
};

export const part2 = (input = defaultInput) => {
    let sum = 0;
    const pattern = /[^\d]/g;

    for (const line of input.split('\n')) {
        const [fstStart, fstEnd, sndStart, sndEnd] = line.split(pattern).map(n => parseInt(n, 10));

        if (!((fstEnd < sndStart) || (sndEnd < fstStart))) {
            sum += 1;
        }
    }

    return sum;
};
