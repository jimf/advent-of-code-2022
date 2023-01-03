#!/usr/bin/env node

import * as aoc from '../src/index.js';

const day = aoc[`day${process.argv[2]}`];

if (day?.part1) {
    console.log(`Part 1: ${day.part1()}`);
}

if (day?.part2) {
    console.log(`Part 2: ${day.part2()}`);
}
