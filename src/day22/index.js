import defaultInput from './input.js';
import coord from '../coord.js';

function *zip(xs, ys) {
    const xsIter = xs[Symbol.iterator]();
    const ysIter = ys[Symbol.iterator]();

    while (true) {
        const x = xsIter.next();
        const y = ysIter.next();

        if (x.done || y.done) {
            break;
        }

        yield [x.value, y.value];
    }
}

class Tile {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.up = null;
        this.right = null;
        this.down = null;
        this.left = null;
    }

    isWall() {
        return this.type === '#';
    }
}

class Side {
    constructor(x, y, size, isBack = false) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.isBack = isBack;
    }

    *top() {
        for (let x = this.x; x < this.x + this.size; x += 1) {
            yield { x, y: this.y };
        }
    }

    *bottom() {
        for (const coord of this.top()) {
            yield { x: coord.x, y: this.y + this.size - 1 };
        }
    }

    *left() {
        const start = this.isBack ? this.y + this.size - 1 : this.y;
        const end = this.isBack ? this.y : this.y + this.size - 1;
        const dy = this.isBack ? -1 : 1;

        for (let y = start; y <= end; y += dy) {
            yield { x: this.x, y };
        }
    }

    *right() {
        for (const coord of this.left()) {
            yield { x: this.x + this.size - 1, y: coord.y };
        }
    }
}

class Player {
    constructor(tile, movements) {
        this.tile = tile;
        this.movements = movements;
        this.facing = 'right';
    }

    move() {
        while (this.movements.length) {
            const movement = this.movements.shift();

            if (movement === 'L' || movement == 'R') {
                const facings = ['up', 'right', 'down', 'left'];
                const current = facings.indexOf(this.facing);
                const shift = movement === 'L' ? -1 : 1;
                this.facing = facings.at((current + shift) % facings.length);
            } else {
                let moves = 0;

                while (moves < movement && !this.tile[this.facing].isWall()) {
                    this.tile = this.tile[this.facing];
                    moves += 1;
                }
            }
        }
    }
}

const parseInput = (input, linkTiles) => {
    const tiles = {};
    const [map, movements] = input.split('\n\n');
    let start;

    // Create tiles and map left/right pointers
    map.split('\n').forEach((line, rowIdx) => {
        const y = rowIdx + 1;

        line.split('').forEach((c, colIdx) => {
            const x = colIdx + 1;

            if (c === '.' || c === '#') {
                const tile = new Tile(c, x, y);
                tiles[coord(tile)] = tile;

                if (c === '.' && !start) {
                    start = tile;
                }
            }
        });
    });

    linkTiles(tiles);
    const moves = movements
        .split(/(\d+|[LR])/)
        .filter(Boolean)
        .map(v => isNaN(v) ? v : Number(v));

    return new Player(start, moves);
};

const wrapTilesAroundMap = tiles => {
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const tile of Object.values(tiles)) {
        maxX = Math.max(maxX, tile.x);
        maxY = Math.max(maxY, tile.y);
    }

    for (let y = 1; y <= maxY; y += 1) {
        let first;
        let last;

        for (let x = 1; x <= maxX; x += 1) {
            const tile = tiles[coord(x, y)];

            if (tile) {
                if (!first) {
                    first = tile;
                }

                if (last) {
                    last.right = tile;
                    tile.left = last;
                }

                last = tile;
            }
        }

        first.left = last;
        last.right = first;
    }

    for (let x = 1; x <= maxX; x += 1) {
        let first;
        let last;

        for (let y = 1; y <= maxY; y += 1) {
            const tile = tiles[coord(x, y)];

            if (tile) {
                if (!first) {
                    first = tile;
                }

                if (last) {
                    last.down = tile;
                    tile.up = last;
                }

                last = tile;
            }
        }

        first.up = last;
        last.down = first;
    }
};

const wrapTilesAroundCube = cubeSize => tiles => {
    // Cube faces: [F]ront, [T]op, [B]ottom, [L]eft, [R]ight
    // Cube edges: [t]op, [r]ight, [b]ottom, [l]eft
    // Connections: Front top -> Top bottom
    //              Front right -> Right left
    //              Front left
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const tile of Object.values(tiles)) {
        maxX = Math.max(maxX, tile.x);
        maxY = Math.max(maxY, tile.y);
    }

    wrapTilesAroundMap(tiles);
    const sides = [];
    const cube = {};
    let arrangement = '';

    for (let y = 1; y <= maxY; y += cubeSize) {
        for (let x = 1; x <= maxX; x += cubeSize) {
            const tile = tiles[coord(x, y)];

            if (tile) {
                arrangement += '1';
                sides.push(new Side(x, y, cubeSize));
            } else {
                arrangement += '0';
            }
        }
    }

    // const faceOrientations = {
    //     top: {
    //         up: 'back',
    //         right: 'right',
    //         down: 'front',
    //         left: 'left',
    //     },
    //     front: {
    //         up: 'top',
    //         right: 'right',
    //         down: 'bottom',
    //         left: 'left',
    //     },
    //     left: {
    //         up: 'top',
    //         right: 'front',
    //         down: 'bottom',
    //         left: 'back',
    //     },
    //     right: {
    //         up: 'top',
    //         right: 'back',
    //         down: 'bottom',
    //         left: 'front',
    //     },
    //     bottom: {
    //         up: 'front',
    //         right: 'right',
    //         down: 'back',
    //         left: 'left',
    //     },
    //     back: {
    //         up: 'bottom',
    //         right: 'right',
    //         down: 'top',
    //         left: 'left',
    //     },
    // };
    // const queue = [{ side: sides[0], face: 'front' }];

    // while (queue.length > 0) {
    //     const { side, face } = queue.shift();

    //     if (!cube[face]) {
    //         cube[face] = side;

    //         if (face === 'back') {
    //             side.isBack = true;
    //         }

    //         const neighbors = [
    //             ['up', other => other.x === side.x && other.y === side.y - cubeSize],
    //             ['right', other => other.x === side.x + cubeSize && other.y === side.y],
    //             ['down', other => other.x === side.x && other.y === side.y + cubeSize],
    //             ['left', other => other.x === side.x - cubeSize && other.y === side.y],
    //         ];

    //         for (const [dir, findSide] of neighbors) {
    //             const neighbor = sides.find(findSide);

    //             if (neighbor) {
    //                 queue.push({
    //                     side: neighbor,
    //                     face: faceOrientations[face][dir],
    //                 });
    //             }
    //         }
    //     }
    // }

    // console.log(sides);
    // console.log(cube);

    // There are 11 distinct ways to flatten a cube:
    //
    //  ###   ##    ##    ##    #     #     #     #      #     #    #
    //   #     ##    ##    #    ###   ##    ##    ##    ###   ##    #
    //   #     #     #     #     #     ##    #     ##    #     ##   ##
    //   #     #     #     ##    #     #     ##     #    #     #     #
    //                                                               #
    //
    // https://math.stackexchange.com/questions/4446200/how-many-distinct-ways-to-flatten-a-cube

    cube.top = sides[0];
    cube.front = sides[3];
    cube.left = sides[2];
    cube.right = sides[5];
    cube.bottom = sides[4];
    cube.back = sides[1];

    // const connectSides = ([sideA, edgeA, dirA], [sideB, edgeB, dirB]) => {
    //     for (const [coordA, coordB] of zip(cube[sideA][edgeA](), cube[sideB][edgeB]())) {
    //         tiles[coord(...coordA)][dirA] = tiles[coord(...coordB)];
    //         tiles[coord(...coordB)][dirB] = tiles[coord(...coordA)];
    //     }
    // }
    // for (const [frontTop, topBottom] of zip(cube.front.top(), cube.top.bottom())) {
    //     tiles[coord(...frontTop)].up = tiles[coord(...topBottom)];
    //     tiles[coord(...topBottom)].down = tiles[coord(...frontTop)];
    // }

    // connectSides(['front', 'top', 'up'], ['top', 'bottom', 'down']);
    // connectSides(['front', 'right', 'right'], ['right', 'left', 'left']);
    // connectSides(['front', 'bottom', 'down'], ['bottom', 'top', 'up']);
    // connectSides(['front', 'left', 'left'], ['left', 'right', 'right']);
    // connectSides(['top', 'top', 'up'], ['back', 'bottom', 'down']);
    // connectSides(['top', 'right', 'right'], ['right', 'top', 'up']);
    // connectSides(['top', 'left'], ['left', 'top']);
    // connectSides(['bottom', 'right'], ['right', 'bottom']);
    // connectSides(['bottom', 'left'], ['left', 'bottom']);
    // connectSides(['bottom', 'bottom'], ['back', 'top']);
    // connectSides(['left', 'left'], ['back', 'left']);
    // connectSides(['right', 'right'], ['back', 'right']);
};

export const part1 = (input = defaultInput) => {
    const player = parseInput(input, wrapTilesAroundMap);
    player.move();
    const facingValues = {
        right: 0,
        down: 1,
        left: 2,
        up: 3,
    };
    return (1000 * player.tile.y) + (4 * player.tile.x) + (facingValues[player.facing]);
};

export const part2 = (input = defaultInput, cubeSize = 50) => {
    const player = parseInput(input, wrapTilesAroundCube(cubeSize));
    player.move();
    const facingValues = {
        right: 0,
        down: 1,
        left: 2,
        up: 3,
    };
    return (1000 * player.tile.y) + (4 * player.tile.x) + (facingValues[player.facing]);
};
