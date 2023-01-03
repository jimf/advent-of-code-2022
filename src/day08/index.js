import defaultInput from './input.js';

const parseInput = input =>
    input.split('\n').map(line => line.split('').map(n => parseInt(n, 10)));

const isVisible = (grid, x, y) => {
    const height = grid[y][x];

    const checkSide = (deltaX, deltaY) => {
        let posX = x + deltaX;
        let posY = y + deltaY;

        while (posX >= 0 && posX < grid[0].length && posY >= 0 && posY < grid.length) {
            if (grid[posY][posX] >= height) {
                return false;
            }

            posX += deltaX;
            posY += deltaY;
        }

        return true;
    };

    return checkSide(0, -1) ||
        checkSide(1, 0) ||
        checkSide(0, 1) ||
        checkSide(-1, 0);
};

const scenicScore = (grid, x, y) => {
    const height = grid[y][x];

    const checkSide = (deltaX, deltaY) => {
        let posX = x + deltaX;
        let posY = y + deltaY;
        let distance = 0;
        let done = false;

        while (posX >= 0 && posX < grid[0].length && posY >= 0 && posY < grid.length && !done) {
            distance += 1
            done = grid[posY][posX] >= height;
            posX += deltaX;
            posY += deltaY;
        }

        return distance;
    };

    return checkSide(0, -1) *
        checkSide(1, 0) *
        checkSide(0, 1) *
        checkSide(-1, 0);
};

export const part1 = (input = defaultInput) => {
    const grid = parseInput(input);
    let totalVisible = 0;

    for (let y = 0; y < grid.length; y += 1) {
        for (let x = 0; x < grid[0].length; x += 1) {
            if (isVisible(grid, x, y)) {
                totalVisible += 1;
            }
        }
    }

    return totalVisible;
};

export const part2 = (input = defaultInput) => {
    const grid = parseInput(input);
    let maxScenicScore = -Infinity;

    for (let y = 0; y < grid.length; y += 1) {
        for (let x = 0; x < grid[0].length; x += 1) {
            maxScenicScore = Math.max(maxScenicScore, scenicScore(grid, x, y));
        }
    }

    return maxScenicScore;
};
