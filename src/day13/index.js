import defaultInput from './input.js';

function* zip(xs, ys) {
    let i = 0;
    const maxLen = Math.max(xs.length, ys.length);

    while (i < maxLen) {
        yield [xs[i], ys[i]];
        i += 1;
    }
}

const comparePackets = (a, b) => {
    // Did left side run out of items? a is before b
    if (typeof a === 'undefined') {
        return -1;
    }

    // Did right side run out of items? a is after b
    if (typeof b === 'undefined') {
        return 1;
    }

    // Both sides are Ints. Check if one side is bigger.
    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }

    // Both sides are Arrays. Compare elements in order to find first of different size.
    if (Array.isArray(a) && Array.isArray(b)) {
        for (const [aa, bb] of zip(a, b)) {
            const result = comparePackets(aa, bb);

            if (result !== 0) {
                return result;
            }
        }

        return 0;
    }

    // Mixed types. Coerce Int to Array(Int) and retry.
    return comparePackets(
        typeof a === 'number' ? [a] : a,
        typeof b === 'number' ? [b] : b,
    );
};

export const part1 = (input = defaultInput) => {
    const lines = input.split('\n');
    const pairs = [];
    let correctPairs = [];

    for (let i = 0; i < lines.length; i += 3) {
        const pair = {
            left: JSON.parse(lines[i]),
            right: JSON.parse(lines[i + 1]),
        };
        pairs.push(pair);

        if (comparePackets(pair.left, pair.right) < 0) {
            // Record index. Puzzle uses 1-based indices, so no need to subtract 1.
            correctPairs.push(pairs.length);
        }
    }

    return correctPairs.reduce((x, y) => x + y, 0);
};

export const part2 = (input = defaultInput) => {
    const dividerPackets = [
        [[2]],
        [[6]],
    ];

    const packets = [...dividerPackets];

    for (const line of input.split('\n')) {
        if (line) {
            packets.push(JSON.parse(line));
        }
    }

    packets.sort(comparePackets);
    return (packets.indexOf(dividerPackets[0]) + 1) * (packets.indexOf(dividerPackets[1]) + 1);
};
