import defaultInput from './input.js';

const getKey = ({ x, y }) => `${x},${y}`;

const parseInput = input => {
    const nodes = {};
    const neighbors = {};
    let start;
    let end;

    // Build object of x,y pairs to node objects
    input.split('\n').forEach((line, y) => {
        line.split('').forEach((c, x) => {
            const node = { x, y, c };

            if (c === 'S') {
                node.value = 'a'.charCodeAt(0);
                start = node;
            } else if (c === 'E') {
                node.value = 'z'.charCodeAt(0);
                end = node;
            } else {
                node.value = c.charCodeAt(0);
            }

            nodes[getKey(node)] = node;
        });
    });

    // Build graph of node neighbors (adjacent squares that can be reached)
    for (const [key, node] of Object.entries(nodes)) {
        neighbors[key] = [
            nodes[getKey({ ...node, y: node.y - 1 })],
            nodes[getKey({ ...node, x: node.x + 1 })],
            nodes[getKey({ ...node, y: node.y + 1 })],
            nodes[getKey({ ...node, x: node.x - 1 })],
        ].filter(other => !!other && other.value <= node.value + 1);
    }

    return { nodes, neighbors, start, end };
};

// Breadth-first-search (BFS) algorithm
const shortestPath = (neighbors, start, end) => {
    const queue = [];
    const seen = new Set(getKey(start));

    for (const neighbor of neighbors[getKey(start)]) {
        queue.push({ node: neighbor, path: [] });
    }

    while (queue.length > 0) {
        const { node: neighbor, path } = queue.shift();
        const key = getKey(neighbor);

        if (!seen.has(key)) {
            seen.add(key);

            if (neighbor === end) {
                return [...path, neighbor];
            }

            for (const nextNeighbor of neighbors[key]) {
                queue.push({ node: nextNeighbor, path: [...path, neighbor] });
            }
        }
    }
};

export const part1 = (input = defaultInput) => {
    const { neighbors, start, end } = parseInput(input);
    const path = shortestPath(neighbors, start, end);
    return path.length;
};

export const part2 = (input = defaultInput) => {
    const { nodes, neighbors, end } = parseInput(input);
    let min = Infinity;

    for (const node of Object.values(nodes)) {
        if (node.value === 'a'.charCodeAt(0)) {
            const path = shortestPath(neighbors, node, end);

            if (path) {
                min = Math.min(path.length, min);
            }
        }
    }

    return min;
};
