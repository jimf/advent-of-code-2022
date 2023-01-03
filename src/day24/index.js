import defaultInput from './input.js';
import Game from '../game.js';

class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Blizzard extends Entity {
    constructor(x, y, direction) {
        super(x, y);
        this.direction = direction;
    }
}

class Player extends Entity {
    constructor(x, y, goal) {
        super(x, y);
        this.goal = goal;
    }
}

class World extends Game {
    
}

class BlizzardSystem {
    update(world) {
        for (const entity of world.entities) {
            if (entity instanceof Blizzard) {
                switch (entity.direction) {
                    case 'up':
                        entity.y = entity.y === 1 ? world.height - 1 : entity.y - 1;
                        break;

                    case 'right':
                        entity.x = entity.x === world.width - 1 ? 1 : entity.x + 1;
                        break;

                    case 'down':
                        entity.y = entity.y === world.height - 1 ? 1 : entity.y + 1;
                        break;

                    case 'left':
                        entity.x = entity.x === 1 ? world.width - 1 : entity.x - 1;
                        break;
                }
            }
        }
    }
}

const parseInput = input => {
    const world = new World();
    let start;
    let end;

    const blizzardDirections = {
        '^': 'up',
        '>': 'right',
        'v': 'down',
        '<': 'left',
    };

    world.width = 0;
    world.height = 0;

    input.split('\n').forEach((line, y) => {
        line.split('').forEach((c, x) => {
            if (c === '.') {
                if (!start) {
                    start = { x, y };
                }

                end = { x, y };
            } else if (Object.keys(blizzardDirections).includes(c)) {
                world.addEntity(new Blizzard(x, y, blizzardDirections[c]));
            }

            world.width = Math.max(world.width, x + 1);
        });

        world.height = Math.max(world.height, y + 1);
    });

    world.player = new Player(start.x, start.y, end);
    return world;
};

export const part1 = (input = defaultInput) => {
    const world = parseInput(input);
};

export const part2 = (input = defaultInput) => {
};
