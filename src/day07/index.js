import defaultInput from './input.js';

class Directory {
    constructor(name) {
        this.name = name;
        this.children = [];
    }

    walk(fn) {
        fn(this);

        for (const child of this.children) {
            child.walk(fn);
        }
    }

    add(child) {
        child.parent = this;
        this.children.push(child);
    }

    size() {
        return this.children.reduce((acc, child) => acc + child.size(), 0);
    }
}

class File {
    constructor(name, size) {
        this.name = name;
        this._size = size;
    }

    walk(fn) {
        fn(this);
    }

    size() {
        return this._size;
    }
}

const parseInput = input => {
    const commands = [];
    const lines = input.split('\n');
    let idx = 0;

    while (idx < lines.length) {
        commands.push({
            command: lines[idx].slice(2),
            output: [],
        });
        idx += 1;

        while (idx < lines.length && !lines[idx].startsWith('$')) {
            commands.at(-1).output.push(lines[idx]);
            idx += 1;
        }
    }

    const root = new Directory('/');
    let cwd = root;

    for (const cmd of commands.slice(1)) {
        if (cmd.command.startsWith('cd')) {
            const dirname = cmd.command.split(' ')[1];

            if (dirname === '..') {
                cwd = cwd.parent;
            } else {
                cwd = cwd.children.find(child => child.name === dirname);
            }
        } else if (cmd.command.startsWith('ls')) {
            for (const output of cmd.output) {
                if (output.startsWith('dir')) {
                    const dir = new Directory(output.split(' ')[1]);
                    cwd.add(dir);
                } else {
                    const [size, filename] = output.split(' ');
                    const file = new File(filename, parseInt(size, 10));
                    cwd.add(file);
                }
            }
        }
    }

    return root;
};

export const part1 = (input = defaultInput) => {
    const root = parseInput(input);
    let sum = 0;

    root.walk(node => {
        if (node instanceof Directory) {
            const size = node.size();

            if (size <= 100000) {
                sum += size;
            }
        }
    });

    return sum;
};

export const part2 = (input = defaultInput) => {
    const root = parseInput(input);
    const free = 70000000 - root.size();
    let min = Infinity;

    root.walk(node => {
        if (node instanceof Directory) {
            const size = node.size();
            const totalFree = free + size;

            if (totalFree >= 30000000 && size < min) {
                min = size;
            }
        }
    });

    return min;
};
