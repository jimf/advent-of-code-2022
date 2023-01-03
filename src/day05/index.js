import defaultInput from './input.js';

const parseArrangement = arrangement => {
    const arrangementLines = arrangement.split('\n');
    const stacks = [];

    for (let i = 0; i < arrangementLines.at(-1).length; i += 1) {
        if (arrangementLines.at(-1).charAt(i) !== ' ') {
            stacks.push([]);
            let j = arrangementLines.length - 2;

            while (j >= 0 && arrangementLines[j][i]?.trim()) {
                stacks.at(-1).push(arrangementLines[j][i]);
                j -= 1;
            }
        }
    }

    return stacks;
};

export const part1 = (input = defaultInput) => {
    const [arrangement, moves] = input.split('\n\n');
    const stacks = parseArrangement(arrangement);
    const pattern = /^move (\d+) from (\d+) to (\d+)$/;

    for (const move of moves.trim().split('\n')) {
        const [n, from, to] = move.match(pattern).slice(1).map(n => parseInt(n, 10));

        for (let i = 0; i < n; i += 1) {
            stacks[to - 1].push(stacks[from - 1].pop());
        }
    }

    return stacks.map(stack => stack.at(-1)).join('');
};

export const part2 = (input = defaultInput) => {
    const [arrangement, moves] = input.split('\n\n');
    const stacks = parseArrangement(arrangement);
    const pattern = /^move (\d+) from (\d+) to (\d+)$/;

    for (const move of moves.trim().split('\n')) {
        const [n, from, to] = move.match(pattern).slice(1).map(n => parseInt(n, 10));
        const tmp = [];

        for (let i = 0; i < n; i += 1) {
            tmp.push(stacks[from - 1].pop());
        }

        while (tmp.length) {
            stacks[to - 1].push(tmp.pop());
        }
    }

    return stacks.map(stack => stack.at(-1)).join('');
};
