import defaultInput from './input.js';
import Game from '../game.js';
import coord from '../coord.js';

class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Wall extends Entity {}
class Sand extends Entity {}
class Floor extends Entity {}

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

    moveEntityIfOpen(entity, x, y) {
        if (this.at(x, y)) {
            return false;
        }

        this.moveEntity(entity, x, y);
        return true;
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

class SandSystem {
    static spawnX = 500;
    static spawnY = 0;

    init(world) {
        this.lowestWallY = -Infinity;

        world.entities.forEach(entity => {
            if (entity instanceof Wall) {
                this.lowestWallY = Math.max(this.lowestWallY, entity.y);
            }
        });
    }

    update(world) {
        let sand;
        let i = world.entities.length - 1;

        while (!sand && i >= 0) {
            if (world.entities[i] instanceof Sand) {
                sand = world.entities[i];
            }

            i -= 1;
        }

        if (!sand) {
            this.addSand(world);
            return;
        }

        const nextPositions = [
            [sand.x, sand.y + 1],
            [sand.x - 1, sand.y + 1],
            [sand.x + 1, sand.y + 1],
        ];

        for (const pos of nextPositions) {
            if (world.moveEntityIfOpen(sand, ...pos)) {
                if (pos[1] === this.lowestWallY) {
                    world.trigger('sand:overflowed', sand);
                }

                return;
            }
        }

        world.trigger('sand:rested', sand);
        this.addSand(world);
    }

    addSand(world) {
        const sand = new Sand(SandSystem.spawnX, SandSystem.spawnY);

        if (world.at(sand.x, sand.y)) {
            world.trigger('sand:blocked');
        } else {
            world.addEntity(sand);
        }
    }
}

class FloorSystem {
    init(world) {
        this.y = -Infinity;

        world.entities.forEach(entity => {
            if (entity instanceof Wall) {
                this.y = Math.max(this.y, entity.y + 2);
            }
        });

        world.on('position:beforeGet', e => {
            if (!e.returned && e.args[1] === this.y) {
                e.returned = new Floor(...e.args);
            }
        });
    }
}

const parseInput = input => {
    const world = new World();

    for (const line of input.split('\n')) {
        const coords = line.split(' -> ').map(coord => coord.split(',').map(n => parseInt(n, 10)));

        for (let i = 0; i < coords.length - 1; i += 1) {
            const from = coords[i];
            const to = coords[i + 1];
            const startX = Math.min(from[0], to[0]);
            const endX = Math.max(from[0], to[0]);
            const startY = Math.min(from[1], to[1]);
            const endY = Math.max(from[1], to[1]);

            for (let y = startY; y <= endY; y += 1) {
                for (let x = startX; x <= endX; x += 1) {
                    if (!world.at(x, y)) {
                        world.addEntity(new Wall(x, y));
                    }
                }
            }
        }
    }

    return world;
};

export const part1 = (input = defaultInput) => {
    const world = parseInput(input);
    world.addSystem(new SandSystem());
    let numSandRested = 0;
    let done = false;

    world.on('sand:rested', () => numSandRested += 1);
    world.on('sand:overflowed', () => { done = true });
    world.init();

    while (!done) {
        world.update();
    }

    return numSandRested;
};

export const part2 = (input = defaultInput) => {
    const world = parseInput(input);
    world.addSystem(new SandSystem());
    world.addSystem(new FloorSystem());
    let numSandRested = 0;
    let done = false;

    world.on('sand:rested', () => numSandRested += 1);
    world.on('sand:blocked', () => { done = true; });
    world.init();

    while (!done) {
        world.update();
    }

    return numSandRested;
};
