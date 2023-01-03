import defaultInput from './input.js';

class Cube {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    isAdjacentTo(other) {
        let numSame = 0;
        let numOneAway = 0;

        for (const property of ['x', 'y', 'z']) {
            if (this[property] === other[property]) {
                numSame += 1;
            } else if (Math.abs(this[property] - other[property]) === 1) {
                numOneAway += 1;
            }
        }

        return numSame === 2 && numOneAway === 1;
    }

    toString() {
        return `${this.x},${this.y},${this.z}`;
    }
}

const parseInput = input => {
    const cubes = [];

    // Parse input
    for (const line of input.split('\n')) {
        const [x, y, z] = line.split(',').map(Number);
        const cube = new Cube(x, y, z)
        cubes.push(cube);
    }

    return cubes;
};

export const part1 = (input = defaultInput) => {
    const cubes = parseInput(input);
    const adjacencies = {};

    // For every possible pair of cubes, check whether the pair are adjacent to
    // one another, recording the results in an adjacency graph.
    for (let i = 0; i < cubes.length - 1; i += 1) {
        for (let j = i + 1; j < cubes.length; j += 1) {
            const a = cubes[i];
            const b = cubes[j];
            adjacencies[a] ??= new Set();
            adjacencies[b] ??= new Set();

            if (a.isAdjacentTo(b)) {
                adjacencies[a].add(b);
                adjacencies[b].add(a);
            }
        }
    }

    // Now calculate total surface area. Each cube has six sides, minus the
    // sides that are adjacent to another cube.
    let totalSurfaceArea = 0;

    for (const adjacent of Object.values(adjacencies)) {
        totalSurfaceArea += (6 - adjacent.size);
    }

    return totalSurfaceArea;
};

export const part2 = (input = defaultInput) => {
    const cubes = parseInput(input);
    const tuples = new Set(cubes.map(c => c.toString()));
    let numPockets = 0;
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];

    // const formsPocket = cube =>
    //     tuples.has(`${cube.x - 1},${cube.y - 1},${cube.z}`) &&
    //     tuples.has(`${cube.x + 1},${cube.y - 1},${cube.z}`) &&
    //     tuples.has(`${cube.x},${cube.y - 1},${cube.z - 1}`) &&
    //     tuples.has(`${cube.x},${cube.y - 1},${cube.z + 1}`) &&
    //     !tuples.has(`${cube.x},${cube.y - 1},${cube.z}`);

    for (const cube of cubes) {
        min[0] = Math.min(min[0], cube.x);
        min[1] = Math.min(min[1], cube.y);
        min[2] = Math.min(min[2], cube.z);

        max[0] = Math.max(min[0], cube.x);
        max[1] = Math.max(min[1], cube.y);
        max[2] = Math.max(min[2], cube.z);
        // if (formsPocket(cube)) {
        //     numPockets += 1;
        // }
    }

    const water = new Set();
    // const queue =

    // 3256 too high
    return part1(input) - (numPockets * 6);
};
