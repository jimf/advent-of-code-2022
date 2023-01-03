import defaultInput from './input.js';

class Monkey {
    static from(def) {
        const [, startingItems, op, test, ifTrue, ifFalse] = def
            .split('\n')
            .map(
                line => line.split(':').pop().trim()
            );

        return new Monkey(
            startingItems.split(',').map(n => parseInt(n, 10)),
            op,
            test,
            ifTrue,
            ifFalse
        );
    }

    constructor(items, op, test, ifTrue, ifFalse) {
        this.items = items;
        this.op = op;
        this.test = test;
        this.ifTrue = ifTrue;
        this.ifFalse = ifFalse;
        this.inspections = 0;
    }

    takeTurn(world) {
        while (this.items.length > 0) {
            this.inspections += 1;
            let worryLevel = this.items.shift();
            worryLevel = this.#evalOp(worryLevel);
            worryLevel = world.player.applyRelief(worryLevel);
            const throwTo = this.evalTest(worryLevel);
            world.monkeys[throwTo].items.push(worryLevel);
        }
    }

    #evalOp(old) {
        const [,, a, op, b] = this.op.split(' ').map(val => {
            if (val === 'old') {
                return old;
            }

            if (!isNaN(val)) {
                return Number(val);
            }

            return val;
        });

        switch (op) {
            case '+': return a + b;
            case '*': return a * b;
            default:
                throw new Error(`Unhandled op: ${op}`);
        }
    }

    evalTest(worryLevel) {
        const modValue = parseInt(this.test.split(' ').at(-1), 10);
        const result = worryLevel % modValue === 0 ? this.ifTrue : this.ifFalse;
        return parseInt(result.split(' ').at(-1), 10);
    }
}

class World {
    constructor({ relief: applyRelief }) {
        this.player = {
            worryLevel: 0,
            applyRelief,
        };
        this.monkeys = [];
    }

    runRound() {
        for (const monkey of this.monkeys) {
            monkey.takeTurn(this);
        }
    }
}

export const part1 = (input = defaultInput) => {
    const world = new World({ relief: value => Math.floor(value / 3) });
    world.monkeys.push(...input.split('\n\n').map(Monkey.from));

    for (let i = 0; i < 20; i += 1) {
        world.runRound();
    }

    const inspections = world.monkeys.map(monkey => monkey.inspections);
    inspections.sort((a, b) => b - a);
    return inspections[0] * inspections[1];
};

export const part2 = (input = defaultInput) => {
    let commonMultiple;
    const world = new World({ relief: value => value % commonMultiple });
    world.monkeys.push(...input.split('\n\n').map(Monkey.from));
    commonMultiple = world.monkeys.reduce((acc, monkey) => acc * parseInt(monkey.test.split(' ')[2], 10), 1);

    for (let i = 0; i < 10000; i += 1) {
        world.runRound();
    }

    const inspections = world.monkeys.map(monkey => monkey.inspections);
    inspections.sort((a, b) => b - a);
    return inspections[0] * inspections[1];
};
