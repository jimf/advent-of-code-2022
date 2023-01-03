import defaultInput from './input.js';

const choices = {
    rock: {
        score: 1,
        play(other) {
            if (other === this) {
                return 0;
            }

            return other === choices.scissors ? 1 : -1;
        },
    },
    paper: {
        score: 2,
        play(other) {
            if (other === this) {
                return 0;
            }

            return other === choices.rock ? 1 : -1;
        },
    },
    scissors: {
        score: 3,
        play(other) {
            if (other === this) {
                return 0;
            }

            return other === choices.paper ? 1 : -1;
        },
    },
};

const opponentChoices = {
    A: choices.rock,
    B: choices.paper,
    C: choices.scissors,
};

export const part1 = (input = defaultInput) => {
    let sum = 0;

    const playerChoices = {
        X: choices.rock,
        Y: choices.paper,
        Z: choices.scissors,
    };

    for (const line of input.split('\n')) {
        const opponent = opponentChoices[line.charAt(0)];
        const player = playerChoices[line.charAt(2)];
        const result = player.play(opponent);

        sum += player.score;

        if (result === 1) {
            sum += 6;
        } else if (result === 0) {
            sum += 3;
        }
    }

    return sum;
};

export const part2 = (input = defaultInput) => {
    let sum = 0;

    const playerChoices = {
        X: new Map(),
        Y: new Map(),
        Z: new Map(),
    };

    playerChoices.X.set(choices.rock, choices.scissors);
    playerChoices.X.set(choices.paper, choices.rock);
    playerChoices.X.set(choices.scissors, choices.paper);

    playerChoices.Y.set(choices.rock, choices.rock);
    playerChoices.Y.set(choices.paper, choices.paper);
    playerChoices.Y.set(choices.scissors, choices.scissors);

    playerChoices.Z.set(choices.rock, choices.paper);
    playerChoices.Z.set(choices.paper, choices.scissors);
    playerChoices.Z.set(choices.scissors, choices.rock);

    for (const line of input.split('\n')) {
        const opponent = opponentChoices[line.charAt(0)];
        const player = playerChoices[line.charAt(2)].get(opponent);
        const result = player.play(opponent);

        sum += player.score;

        if (result === 1) {
            sum += 6;
        } else if (result === 0) {
            sum += 3;
        }
    }

    return sum;
};
