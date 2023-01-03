import defaultInput from './input.js';

class VM {
    constructor(onUpdate) {
        this.rx = 1;
        this.cycles = 0;
        this.display = new Array(6).fill(null).map(() => new Array(40).fill(' '));
        this.onUpdate = onUpdate;
        this.x = 0;
        this.y = 0;
    }

    eval(instruction) {
        if (instruction === 'noop') {
            this.noop();
        } else if (instruction.startsWith('addx')) {
            this.addx(parseInt(instruction.split(' ')[1]));
        }
    }

    noop() {
        this.#cycle();
    }

    addx(value) {
        this.#cycle();
        this.#cycle();
        this.rx += value;
    }

    #cycle() {
        this.cycles += 1;
        this.display[this.y][this.x] = this.x >= this.rx - 1 && this.x <= this.rx + 1 ? '#' : '.';
        this.x += 1;

        if (this.x === 40) {
            this.x = 0;
            this.y = (this.y + 1) % 6;
        }

        this.onUpdate();
    }
}

export const part1 = (input = defaultInput) => {
    const signalsToCheck = [20, 60, 100, 140, 180, 220];
    const signalStrengths = [];
    const vm = new VM(() => {
        if (signalsToCheck.includes(vm.cycles)) {
            signalStrengths.push(vm.rx * vm.cycles);
        }
    });

    for (const instruction of input.split('\n')) {
        vm.eval(instruction);
    }

    return signalStrengths.reduce((x, y) => x + y, 0);
};

export const part2 = (input = defaultInput) => {
    const vm = new VM(() => {});

    for (const instruction of input.split('\n')) {
        vm.eval(instruction);
    }

    return '\n' + vm.display.map(line => line.join('')).join('\n');
};
