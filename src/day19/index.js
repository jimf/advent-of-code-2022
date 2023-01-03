import defaultInput from './input.js';
import Game from '../game.js';

const parseInput = input => {
    const blueprints = [];

    for (const line of input.split('\n')) {
        const blueprint = {};
        const matches = line.matchAll(/Each (\w+) robot costs (.+?)\./g);

        for (const match of matches) {
            blueprint[match[1]] = match[2].split(' and ').reduce((acc, cost) => {
                const [amount, resource] = cost.split(' ');
                acc[resource] = parseInt(amount, 10);
                return acc;
            }, {});
        }

        blueprints.push(blueprint);
    }

    return blueprints;
};

class World extends Game {
    constructor(options = {}) {
        super();
        this.options = options;
        this.minute = 0;
        this.player = {
            resources: {
                ore: 0,
                clay: 0,
                obsidian: 0,
                geode: 0,
            },
            robots: {
                ore: 1,
                clay: 0,
                obsidian: 0,
                geode: 0,
            },
        };
    }

    update() {
        this.minute += 1;
        this.log(`== Minute ${this.minute} ==`);
        super.update();
    }

    log(message) {
        if (this.options.loggingEnabled) {
            console.log(message);
        }
    }

    #tick(message = '') {
        this.minute += 1;
        this.log(`== Minute ${this.minute} ==`);
        this.log(message);
    }
}

const plural = (value, replacements) => {
    let replacement;

    switch (value) {
        case 0:
            replacement = replacements.zero ?? replacements.other;
            break;

        case 1:
            replacement = replacements.one ?? replacements.other;
            break;

        default:
            replacement = replacements.other;
    }

    return replacement.replace('#', value);
};

class ResourceSystem {
    constructor(blueprint) {
        this.blueprint = blueprint;
    }

    update(world) {
        this.collect(world);
    }

    collect(world) {
        for (const [resource, count] of Object.entries(world.player.robots)) {
            if (count > 0) {
                world.player.resources[resource] += count;
                const newAmount = world.player.resources[resource];
                const collectors = plural(count, {
                    one: `# ${resource}-collecting robot collects`,
                    other: `# ${resource}-collecting robots collect`,
                });
                world.log(`${collectors} ${count} ${resource}; you now have ${newAmount} ${resource}.`)
            }
        }
    }
}

export const part1 = (input = defaultInput) => {
    const blueprints = parseInput(input);
    const world = new World();
    world.addSystem(new ResourceSystem(blueprints[0]));
    world.update();
};

export const part2 = (input = defaultInput) => {
};
