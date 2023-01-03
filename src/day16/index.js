import defaultInput from './input.js';

// const traversePipes = (valves, valve, timeRemaining = 30, seen = new Set(), state = ) => {
//     if (timeRemaining <= 0) {
//         return paths;
//     }
// };

class World {
    constructor(valves, options = {}) {
        this.valves = valves;
        this.options = options;
        this.currentPressureReleased = 0;
        this.totalPressureReleased = 0;
        this.minute = 0;
        this.position = 'AA';
        this.valvesOpened = new Set();
        this.maxMinute = 30;
    }

    run() {
        while (this.minute < this.maxMinute) {
            if (this.#shouldOpenCurrentValve()) {
                this.#open();
            } else if (this.#getPressurizedValves().length > 0) {
                this.#moveTo(this.#getBestMove());
            } else {
                this.#tick();
            }
        }

        return this.totalPressureReleased;
        // this.#moveTo('DD'); // minute  1
        // this.#open();       // minute  2
        // this.#moveTo('CC'); // minute  3 20
        // this.#moveTo('BB'); // minute  4 20
        // this.#open();       // minute  5 20
        // this.#moveTo('AA'); // minute  6
        // this.#moveTo('II'); // minute  7
        // this.#moveTo('JJ'); // minute  8
        // this.#open();       // minute  9
        // this.#moveTo('II'); // minute 10
        // this.#moveTo('AA'); // minute 11
        // this.#moveTo('DD'); // minute 12
        // this.#moveTo('EE'); // minute 13
        // this.#moveTo('FF'); // minute 14
        // this.#moveTo('GG'); // minute 15
        // this.#moveTo('HH'); // minute 16
        // this.#open();       // minute 17
        // this.#moveTo('GG'); // minute 18
        // this.#moveTo('FF'); // minute 19
        // this.#moveTo('EE'); // minute 20
        // this.#open();       // minute 21
        // this.#moveTo('DD'); // minute 22
        // this.#moveTo('CC'); // minute 23
        // this.#open();       // minute 24
        // this.#tick();       // minute 25
        // this.#tick();       // minute 26
        // this.#tick();       // minute 27
        // this.#tick();       // minute 28
        // this.#tick();       // minute 29
        // this.#tick();       // minute 30
        // this.#log(`Total pressure released: ${this.totalPressureReleased}`);
    }

    #isValveOpen(valve) {
        return this.valvesOpened.has(valve);
    }

    #getPressurizedValves() {
        const remaining = [];

        for (const valve of Object.values(this.valves)) {
            if (!this.#isValveOpen(valve.name) && valve.rate > 0) {
                remaining.push(valve);
            }
        }

        return remaining;
    }

    #shouldOpenCurrentValve() {
        if (this.#isValveOpen(this.position)) {
            return false;
        }

        const remainingClosedValveRates = this.#getPressurizedValves().map(valve => valve.rate);
        const average = remainingClosedValveRates.reduce((x, y) => x + y, 0) / remainingClosedValveRates.length;
        // remainingClosedValveRates.sort((a, b) => a - b);
        // const median = remainingClosedValveRates[Math.floor(remainingClosedValveRates.length / 2)];
        // console.log({ remainingClosedValveRates, median, current: this.valves[this.position].rate, 'open?': this.valves[this.position].rate > median });
        // const index = remainingClosedValveRates.indexOf(this.valves[this.position].rate);
        // console.log({ remainingClosedValveRates, average, current: this.valves[this.position].rate, 'open?': this.valves[this.position].rate >= average });
        return this.valves[this.position].rate >= average;
        // return this.valves[this.position].rate > median;
    }

    #getBestMove() {
        const findPaths = (paths, remaining) => {
            if (remaining === 0) {
                return paths;
            }

            return findPaths(
                paths.flatMap(path => {
                    const next = [];

                    for (const leadsTo of this.valves[path.at(-1)].leadsTo) {
                        next.push([...path, leadsTo]);
                    }

                    return next;
                }),
                remaining - 1
            );
        }

        // 1372 too low
        // [DD] CC [BB] AA II [JJ] II AA DD EE FF GG [HH] GG FF [EE] DD [CC]
        const moves = findPaths(this.valves[this.position].leadsTo.map(m => [m]), Math.min(10, this.maxMinute - this.minute))
            .map(move => {
                let score = 0;
                const seen = new Set();
                let minutes = this.maxMinute - this.minute;

                // console.log(move.join(' -> '));
                move.forEach(mv => {
                    minutes = Math.max(0, minutes - 1);
                    const rate = this.valves[mv].rate;

                    if (!seen.has(mv) && !this.#isValveOpen(mv) && rate > 3) {
                        minutes = Math.max(0, minutes - 1);
                        score += rate * minutes;
                        // console.log({ mv, rate, minutes });
                        seen.add(mv);
                    }
                });
                return { move, score };
            })
            .sort((a, b) => b.score - a.score);
        // console.log(moves.map(({ move, score }) => `${score}: ${move.join(' -> ')}`));

        return moves[0].move[0];

        // const moves = this.valves[this.position].leadsTo.map(m => [m]);
        // const seen = new Set([this.position, ...moves]);
        // let bestMove;

        // const updateBestMove = () => {
        //     bestMove = moves
        //         .map(ms => ms.at(-1))
        //         .filter(valve => this.#isValveOpen(valve))
        //         .sort((a, b) => this.valves[b].rate - this.valves[a].rate)
        //         .pop();
        // };

        // updateBestMove();

        // while (!bestMove) {
        //     updateBest();
        // }

        const getBestMove = (moves, seen) => {
            const bestMove = moves
                .filter(mv => !this.#isValveOpen(mv.at(-1)))
                .sort((a, b) => this.valves[b.at(-1)].rate - this.valves[a.at(-1)].rate)
                .at(0);

            if (bestMove) {
                return bestMove[0];
            }

            const nextSeen = { ...seen };
            const nextMoves = moves.flatMap(move => {
                nextSeen[move.at(-1)] = true;
                const next = [];

                for (const leadsTo of this.valves[move.at(-1)].leadsTo) {
                    if (!seen[leadsTo]) {
                        next.push([...move, leadsTo]);
                        nextSeen[leadsTo] = true;
                    }
                }

                return next;
            });

            return getBestMove(nextMoves, nextSeen);
        };

        return getBestMove(
            this.valves[this.position].leadsTo.map(v => [v]),
            { [this.position]: true }
        );

        // const getBestMove = (neighbors, path = [], seen = {}) => {
        //     const { leadsTo } = this.valves[valve];
        //     const bestMoves = valves
        //         .filter(valve => this.#isValveOpen(valve))
        //         .sort((a, b) => this.valves[b].rate - this.valves[a].rate);
        // }

        // const traverseGraph = (remainingSteps, seen)
        // const seen = new Set([this.position]);
        // const rates = {};
        // const parents = {};

        // const getHighestRateValve = () => {
        //     const highest = { valve: null, rate: -Infinity };

        //     for (const [valve, rate] of Object.entries(rates)) {
        //         if (rate > highest.rate) {
        //             highest.valve = valve;
        //             highest.rate = rate;
        //         }
        //     }

        //     return highest.valve;
        // };

        // for (const valve of Object.values(this.valves)) {
        //     rates[valve.name] = this.#isValveOpen(valve.name) ? 0 : valve.rate;
        // }

        // for (const valve of this.valves[this.position].leadsTo) {
        //     parents[valve] = this.position;
        // }

        // let node = getHighestRateValve();
        // let rateAdjustment = 0;

        // while (node) {
        //     rateAdjustment -= 1;
        //     let rate = rates[node];
        //     const neighbors = this.valves[node].leadsTo;

        //     for (const neighbor of neighbors) {
        //         const newRate = Math.max(0, rate + (this.#isValveOpen(neighbor) ? 0 : this.valves[neighbor].rate) + rateAdjustment);

        //         if (rates[neighbor] < newRate) {
        //             rates[neighbor] = newRate;
        //             parents[neighbor] = node;
        //         }
        //     }

        //     seen.add(node);
        //     node = getHighestRateValve();
        // }

        // console.log(parents);
        // this.#tick();

        // const getValveNeighbors = valveName =>
        //     this.valves[valveName].leadsTo
        //         .filter(valve => this.#isValveOpen(valve))
        //         .sort((a, b) => this.valves[b].rate - this.valves[a].rate);

        // const getBestMove = valves => {
        //     const { leadsTo } = this.valves[valve];
        //     const bestMoves = valves
        //         .filter(valve => this.#isValveOpen(valve))
        //         .sort((a, b) => this.valves[b].rate - this.valves[a].rate);

        //     if (bestMoves.length > 0) {
        //         return bestMoves[0];
        //     }

        //     return leadsTo.map(neighbor => ({ neighbor, best }))
        // };

        // const neighbors = this.valves[this.position.lea]
        // const seen = new Set([this.position]);
        // const queue = [this.position];

        // while (queue.length > 0) {
        //     const valve = queue.shift();
        //     const { leadsTo } = this.valves[valve];
        //     const bestMoves = leadsTo
        //         .filter(valve => this.#isValveOpen(valve))
        //         .sort((a, b) => this.valves[b].rate - this.valves[a].rate);

        //     if (bestMoves.length > 0) {
        //         return bestMoves[0];
        //     }
        // }
        // const queue = this.valves[this.position].leadsTo
        //     .filter(valve => this.#isValveOpen(valve))
        //     .sort((a, b) => this.valves[b].rate - this.valves[a].rate);

        // if (!bestMoves.length) {
        //     this.#log('no best moves')
        // }

        // return bestMoves.length ? bestMoves[0].name : leadsTo[0];
    }

    #log(message) {
        if (this.options.loggingEnabled) {
            console.log(message);
        }
    }

    #tick(message = '') {
        this.minute += 1;
        this.totalPressureReleased += this.currentPressureReleased;
        this.#log(`== Minute ${this.minute} ==`);

        const opened = Array.from(this.valvesOpened);

        if (opened.length === 0) {
            this.#log('No valves are open.');
        } else if (opened.length === 1) {
            this.#log(`Valve ${opened} is open, releasing ${this.currentPressureReleased} pressure.`);
        } else if (opened.length === 2) {
            this.#log(`Valves ${opened.join(' and ')} are open, releasing ${this.currentPressureReleased} pressure.`);
        } else {
            const list = `${opened.slice(0, -1).join(', ')}, and ${opened.at(-1)}`;
            this.#log(`Valves ${list} are open, releasing ${this.currentPressureReleased} pressure.`);
        }

        this.#log(message);
    }

    #moveTo(newPosition) {
        this.#tick(`You move to valve ${newPosition}.\n`);
        this.position = newPosition;
    }

    #open() {
        this.#tick(`You open valve ${this.position}.\n`);
        this.valvesOpened.add(this.position);
        this.currentPressureReleased += this.valves[this.position].rate;
    }
}

export const part1 = (input = defaultInput) => {
    const valves = {};
    input = `
Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`.trim();

    for (const line of input.split('\n')) {
        const words = line.split(' ');
        const valve = {
            name: words[1],
            rate: parseInt(words[4].split('=').pop(), 10),
            leadsTo: words.slice(9).map(name => name.trim().replace(',', '')),
        };
        valves[valve.name] = valve;
    }

    const world = new World(valves, { loggingEnabled: false });
    return world.run();
};

export const part2 = (input = defaultInput) => {
};
