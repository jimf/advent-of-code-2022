import defaultInput from './input.js';
import Game from '../game.js';

// Rock data. Rotations are defined in binary, where a 1 indicates the presence
// of a "mino", or rock segment. Separators have been used to better visualize
// how the rows stack. For example, take the "J" shape:
//
//    J: 0b111_001_001 ->    001   #
//                           001   #
//                        0b 111 ###
const rockData = {
    _: {
        tag: '_',
        width: 4,
        height: 1,
        rotations: [0b1111],
    },
    t: {
        tag: 't',
        width: 3,
        height: 3,
        rotations: [0b010_111_010],
    },
    J: {
        tag: 'J',
        width: 3,
        height: 3,
        rotations: [0b111_001_001],
    },
    I: {
        tag: 'I',
        width: 1,
        height: 4,
        rotations: [0b1_1_1_1],
    },
    O: {
        tag: 'O',
        width: 2,
        height: 2,
        rotations: [0b11_11],
    },
};

class Rock {
    constructor(tag, x, y) {
        this.tag = tag;
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.actions = ['push', 'fall'];
        this.actionPointer = 0;
    }

    /**
     * Generate the individual minoes for this rock. Minoes are generated
     * according to the rotations definition, working from left-to-right,
     * bottom-to-top.
     */
    *minoes() {
        const { width, height, rotations } = rockData[this.tag];
        const rotation = rotations[this.rotation];
        const size = width * height;
        let pow = Math.pow(2, size - 1);
        let dx = 0;
        let dy = 0;

        while (pow > 0) {
            if (rotation & pow) {
                const mino = {
                    x: this.x + dx,
                    y: this.y + dy,
                };
                yield mino;
            }

            pow = pow >> 1;
            dx = (dx + 1) % width;
            dy = dx === 0 ? dy + 1 : dy;
        }
    }

    nextAction() {
        const value = this.actions[this.actionPointer];
        this.actionPointer = (this.actionPointer + 1) % this.actions.length;
        return value;
    }
}

class Grid {
    constructor() {
        // Grid is stored as a uint8 array. Individual bits are used to record
        // the presence of a mino. Examples:
        //     0b0000000: empty row
        //     0b1111111: full row
        //     0b0011110: row containing a "_" rock
        this.size = 4096;
        this.grid = new Uint8Array(this.size);
        this.width = 7;
        this.top = -1;
    }

    isInBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0;
    }

    get(x, y) {
        return Boolean(this.grid[y] & (1 << this.width - x - 1));
    }

    set(x, y) {
        if (y >= this.size) {
            while (y >= this.size) {
                this.size *= 2;
            }

            const newGrid = new Uint8Array(this.size);

            for (let row = 0; row < this.grid.length; row += 1) {
                newGrid[row] = this.grid[row];
            }

            delete this.grid;
            this.grid = newGrid;
        }

        this.grid[y] |= (1 << (this.width - x - 1));
        this.top = Math.max(this.top, y);
    }
}

class World extends Game {
    constructor() {
        super();
        this.grid = new Grid();
    }

    toString() {
        const lines = [];
        const rock = this.entities.find(entity => entity instanceof Rock);
        const minoes = rock ? [...rock.minoes()] : [];
        const maxY = Math.max(
            0,
            this.grid.top,
            minoes.reduce((acc, rock) => Math.max(acc, rock.y), 0),
        );
        lines.push('+-------+');

        for (let y = 0; y <= maxY; y += 1) {
            lines.push('|');

            for (let x = 0; x < this.grid.width; x += 1) {
                let c = '.';

                if (this.grid.get(x, y)) {
                    c = '#';
                } else if (minoes.find(m => m.x === x && m.y === y)) {
                    c = '@';
                }

                lines[lines.length - 1] += c;
            }

            lines[lines.length - 1] += '|';
        }

        lines.reverse();
        return lines.join('\n');
    }
}

class RockSystem {
    constructor(jetPattern) {
        this.jetPattern = jetPattern;
        this.nextJet = 0;
        this.rocksGenerated = 0;
        this.rockTypes = Object.keys(rockData);
    }

    update(world) {
        let rock = world.entities.find(entity => entity instanceof Rock);

        if (!rock) {
            rock = this.generateRock(world);
            world.addEntity(rock);
            world.trigger('rock:spawned', rock);
            return;
        }

        switch (rock.nextAction()) {
            case 'fall':
                if (!this.moveIfAble(world, rock, rock.x, rock.y - 1)) {
                    for (const mino of rock.minoes()) {
                        world.grid.set(mino.x, mino.y);
                    }

                    world.trigger('rock:stopped', rock);
                    world.removeEntity(rock);
                }

                break;

            case 'push': {
                const jetDirection = this.jetPattern.charAt(this.nextJet);
                this.nextJet = (this.nextJet + 1) % this.jetPattern.length;
                const dx = jetDirection === '<' ? -1 : 1;
                this.moveIfAble(world, rock, rock.x + dx, rock.y);
                break;
            }
        }
    }

    generateRock(world) {
        const nextRockType = this.rockTypes[this.rocksGenerated % this.rockTypes.length];
        const rock = new Rock(nextRockType, 2, world.grid.top + 4);
        this.rocksGenerated += 1;
        return rock;
    }

    moveIfAble(world, rock, x, y) {
        const newRock = new Rock(rock.tag, x, y);

        for (const mino of newRock.minoes()) {
            if (!world.grid.isInBounds(mino.x, mino.y) || world.grid.get(mino.x, mino.y)) {
                return false;
            }
        }

        rock.x = x;
        rock.y = y;

        return true;
    }
}

export const part1 = (input = defaultInput) => {
    let rocksStopped = 0;
    const world = new World();
    world.addSystem(new RockSystem(input));
    world.on('rock:stopped', () => { rocksStopped += 1 });
    world.init();

    while (rocksStopped < 2022) {
        world.update();
    }

    return world.grid.top + 1;
};

export const part2 = (input = defaultInput) => {
    const maxRocksStopped = 1000000000000;
    const world = new World();
    const rockSystem = new RockSystem(input);
    let rocksStopped = 0;
    const gameStates = {};
    let cycleDetected = false;
    let addedHeight = 0;

    world.addSystem(rockSystem);
    world.on('rock:stopped', () => { rocksStopped += 1 });
    world.on('rock:spawned', rock => {
        if (!cycleDetected && world.grid.top > 20 && world.entities[0]) {
            const valleyHeights = new Array(world.grid.width);

            for (let x = 0; x < world.grid.width; x += 1) {
                let y = world.grid.top;

                while (!world.grid.get(x, y)) {
                    y -= 1;
                }

                valleyHeights[x] = world.grid.top - y;
            }

            const state = `${rock.tag} ${valleyHeights.join(' ')} ${rockSystem.nextJet}`;

            if (gameStates[state]) {
                cycleDetected = true;
                const rocksStoppedInCycle = rocksStopped - gameStates[state].rocksStopped;
                const heightGainedInCycle = (world.grid.top + 1) - gameStates[state].height;

                const numRemainingRocks = maxRocksStopped - rocksStopped;
                const numRemainingCycles = Math.floor(numRemainingRocks / rocksStoppedInCycle);
                const remainder = numRemainingRocks % rocksStoppedInCycle;
                addedHeight = heightGainedInCycle * numRemainingCycles;
                rocksStopped = maxRocksStopped - remainder;
            }

            gameStates[state] = { rocksStopped, height: world.grid.top + 1 };
        }
    });

    world.init();

    while (rocksStopped < maxRocksStopped) {
        world.update();
    }

    return world.grid.top + 1 + addedHeight;
};
