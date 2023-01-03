import defaultInput from './input.js';

function noop() {}

class Knot {
    #updateFn = noop;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.next = null;
        this.prev = null;
    }

    onUpdate(fn) {
        this.#updateFn = fn;
    }

    move(direction, count) {
        const moveDelta = {
            U: [0, -1],
            R: [1, 0],
            D: [0, 1],
            L: [-1, 0],
        };
        const [deltaX, deltaY] = moveDelta[direction];

        for (let i = 0; i < count; i += 1) {
            this.x += deltaX;
            this.y += deltaY;
            this.prev.updatePosition();
        }
    }

    #isAdjacentToNext() {
        return Math.abs(this.next.x - this.x) <= 1 && Math.abs(this.next.y - this.y) <= 1;
    }

    updatePosition() {
        const delta = [0, 0];

        // Adjacent; nothing to do
        if (this.#isAdjacentToNext()) {
            return;
        }

        let sameRow = false;
        let sameCol = false;

        // Same row. Move closer.
        if (this.y === this.next.y) {
            sameRow = true;
            delta[0] += this.next.x > this.x ? 1 : -1;
        }

        // Same column. Move closer.
        if (this.x === this.next.x) {
            sameCol = true;
            delta[1] += this.next.y > this.y ? 1 : -1;
        }

        // Diagonal. Move diagnally.
        if (!sameRow && !sameCol) {
            delta[0] += this.next.x > this.x ? 1 : -1;
            delta[1] += this.next.y > this.y ? 1 : -1;
        }

        this.x += delta[0];
        this.y += delta[1];
        this.#updateFn(this);

        if (this.prev) {
            this.prev.updatePosition();
        }
    }
}

export const part1 = (input = defaultInput) => {
    const tailPositions = new Set([`0,0`]);
    const head = new Knot();
    const tail = new Knot();
    head.prev = tail;
    tail.next = head;

    tail.onUpdate(() => {
        tailPositions.add(`${tail.x},${tail.y}`);
    });

    for (const line of input.split('\n')) {
        const [dir, count] = line.split(' ');
        head.move(dir, parseInt(count, 10));
    }

    return tailPositions.size;
};

export const part2 = (input = defaultInput) => {
    const head = new Knot();
    let tail = head;

    for (let i = 0; i < 9; i += 1) {
        const knot = new Knot();
        knot.next = tail;
        tail.prev = knot;
        tail = knot;
    }

    const tailPositions = new Set([`0,0`]);

    tail.onUpdate(() => {
        tailPositions.add(`${tail.x},${tail.y}`);
    });

    for (const line of input.split('\n')) {
        const [dir, count] = line.split(' ');
        head.move(dir, parseInt(count, 10));
    }

    return tailPositions.size;
};
