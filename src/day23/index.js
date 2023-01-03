import defaultInput from './input.js';
import Game from '../game.js';
import coord from '../coord.js';

class World extends Game {
    constructor() {
        super();
        this.positions = {};
    }

    addEntity(entity) {
        super.addEntity(entity);
        this.positions[coord(entity)] = entity;
        return this;
    }

    moveEntity(entity, x, y) {
        delete this.positions[coord(entity)];
        entity.x = x;
        entity.y = y;
        this.positions[coord(entity)] = entity;
        return this;
    }

    at(x, y) {
        const event = {
            args: [x, y],
            returned: this.positions[coord(x, y)],
        };

        this.trigger('position:beforeGet', event);
        return event.returned;
    }
}

class Elf {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    *north() {
        yield { x: this.x - 1, y: this.y - 1 };
        yield { x: this.x, y: this.y - 1 };
        yield { x: this.x + 1, y: this.y - 1 };
    }

    *east() {
        yield { x: this.x + 1, y: this.y - 1 };
        yield { x: this.x + 1, y: this.y };
        yield { x: this.x + 1, y: this.y + 1 };
    }

    *south() {
        yield { x: this.x - 1, y: this.y + 1 };
        yield { x: this.x, y: this.y + 1 };
        yield { x: this.x + 1, y: this.y + 1 };
    }

    *west() {
        yield { x: this.x - 1, y: this.y - 1 };
        yield { x: this.x - 1, y: this.y };
        yield { x: this.x - 1, y: this.y + 1 };
    }
}

class MovementSystem {
    constructor() {
        this.directions = ['north', 'south', 'west', 'east'];
    }

    update(world) {
        const proposedMoves = {};

        for (const elf of world.entities) {
            const positions = this.directions.map(direction => [...elf[direction]()]);
            const openPositions = positions.map(
                coords => coords.every(({ x, y }) => !world.at(x, y))
            );
            const allPositionsOpen = openPositions.every(Boolean);
            const firstOpen = positions[openPositions.indexOf(true)];

            if (!allPositionsOpen && firstOpen) {
                proposedMoves[coord(firstOpen[1])] ??= new Set();
                proposedMoves[coord(firstOpen[1])].add(elf);
            }
        }

        let numElvesMoved = 0;

        for (const [pos, elves] of Object.entries(proposedMoves)) {
            if (elves.size === 1) {
                const [elf] = elves;
                const [x, y] = pos.split(',').map(Number);
                world.moveEntity(elf, x, y);
                numElvesMoved += 1;
            }
        }

        if (numElvesMoved === 0) {
            world.trigger('elves:noneMoved');
            return;
        }

        this.directions.push(this.directions.shift());
    }
}

const parseInput = input => {
    const world = new World();

    input.split('\n').forEach((line, y) => {
        line.split('').forEach((c, x) => {
            if (c === '#') {
                world.addEntity(new Elf(x, y));
            }
        });
    });

    return world;
};

export const part1 = (input = defaultInput) => {
    const world = parseInput(input);
    world.addSystem(new MovementSystem());

    for (let i = 0; i < 10; i += 1) {
        world.update();
    }

    const min = { x: Infinity, y: Infinity };
    const max = { x: -Infinity, y: -Infinity };

    world.entities.forEach(elf => {
        min.x = Math.min(min.x, elf.x);
        min.y = Math.min(min.y, elf.y);
        max.x = Math.max(max.x, elf.x);
        max.y = Math.max(max.y, elf.y);
    });

    let numEmptyTiles = 0;

    for (let y = min.y; y <= max.y; y += 1) {
        for (let x = min.x; x <= max.x; x += 1) {
            if (!world.at(x, y)) {
                numEmptyTiles += 1;
            }
        }
    }

    return numEmptyTiles;
};

export const part2 = (input = defaultInput) => {
    const world = parseInput(input);
    world.addSystem(new MovementSystem());
    let done = false;
    let numUpdates = 0;

    world.on('elves:noneMoved', () => {
        done = true;
    });

    while (!done) {
        world.update();
        numUpdates += 1;
    }

    return numUpdates;
};
