# Advent of Code 2022

My [Advent of Code 2022](https://adventofcode.com/2022) solutions, implemented in JavaScript.

## Progress

41 / 50

```
25 ★
24
23 ★★
22 ★
21 ★★
20 ★★
19
18 ★
17 ★★
16
15 ★★
14 ★★
13 ★★
12 ★★
11 ★★
10 ★★
 9 ★★
 8 ★★
 7 ★★
 6 ★★
 5 ★★
 4 ★★
 3 ★★
 2 ★★
 1 ★★
```

## Usage

__Requirements__

- [Node.js](https://nodejs.org/en/download/) (solutions were written using version 18.12.1)
- [npm](https://www.npmjs.com/) (included when installing Node.js)

__Setup__

1. Fork/clone repository
2. Run `npm install` to install dependencies

__Command Line__

Run the solution for a given day (replace `1` with desired day number):

```
npm run day -- 1
```

Run the solution for all days:

```
for day in $(seq 1 25); do echo "== Day $day =="; node bin/aoc2022.js $day; echo; done
```

__API__

All puzzles are exported by day, and each day exposes `part1` and `part2` functions.
Each part function accepts an optional `input` string param to run the solution with a given input.
If not specified, my puzzle inputs will be used.
Some days accept additional parameters.

```
import { day1 } from './src/index.js'; // Modify import path as needed

day1.part1();
day1.part2();
```
