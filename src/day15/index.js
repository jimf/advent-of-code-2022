import defaultInput from './input.js';

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distanceTo(other) {
        return Math.abs(other.x - this.x) + Math.abs(other.y - this.y);
    }

    isEqual(other) {
        return this.x === other.x && this.y === other.y;
    }

    toString() {
        return `${this.x},${this.y}`;
    }
}

class Interval {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    compareTo(other) {
        if (this.b < other.a) {
            return -1;
        }

        if (this.a > other.b) {
            return 1;
        }

        return 0;
    }

    contains(x) {
        return this.a <= x && x <= this.b;
    }

    overlaps(other) {
        return this.contains(other.a) || this.contains(other.b);
    }

    size() {
        return this.b - this.a + 1;
    }
}

const parseInput = input => {
    const points = {};
    const sensors = new Set();
    const sensorsToBeacons = new Map();
    const pattern = /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;

    const getOrCreatePoint = (x, y) => {
        let point = points[`${x},${y}`];

        if (!point) {
            point = new Point(x, y);
            points[point] = point;
        }

        return point;
    };

    for (const line of input.split('\n')) {
        const [sx, sy, bx, by] = line.match(pattern).slice(1).map(Number);
        const sensor = getOrCreatePoint(sx, sy);
        const beacon = getOrCreatePoint(bx, by)
        sensors.add(sensor);
        sensorsToBeacons.set(sensor, beacon);
    }

    return { points, sensors, sensorsToBeacons };
};

const getSensorIntersectionPoints = (sensorsToBeacons, sensor, y) => {
    const intersections = [];
    const radius = sensor.distanceTo(sensorsToBeacons.get(sensor));
    const distanceY = Math.abs(y - sensor.y);

    if (distanceY <= radius) {
        const left = new Point(sensor.x - (radius - distanceY), y);
        const right = new Point(sensor.x + (radius - distanceY), y);
        intersections.push(left);

        if (!left.isEqual(right)) {
            intersections.push(right);
        }
    }

    return intersections;
};

const combineIntervals = intervals => {
    // Sort the intervals, with the assumption that this will ensure all
    // collapsible intervals will be adjacent to one another.
    intervals.sort((a, b) => a.compareTo(b));

    // Collapse overlapping intervals
    let i = 0;
    let anyCombined = false;

    while (i < intervals.length - 1) {
        if (intervals[i].overlaps(intervals[i + 1])) {
            intervals[i] = new Interval(
                Math.min(intervals[i].a, intervals[i + 1].a),
                Math.max(intervals[i].b, intervals[i + 1].b),
            );
            intervals.splice(i + 1, 1);
            anyCombined = true;
        } else {
            i += 1;
        }
    }

    if (anyCombined) {
        combineIntervals(intervals);
    }
};

const getIntervalsForRow = (sensors, sensorsToBeacons, y) => {
    // Goal: build an array of intervals for the row that capture where the
    // signal radii start and end. We'll then collapse those intervals together
    // so overlapping intervals are combined into single instances. These
    // intervals will then be used to more efficiently jump across points
    // without the need to visit each one.
    const intervals = [];

    // Loop over sensors to build initial interval array
    for (const sensor of sensors) {
        const [left, right] = getSensorIntersectionPoints(sensorsToBeacons, sensor, y);

        if (left && right) {
            intervals.push(new Interval(left.x, right.x));
        }
    }

    combineIntervals(intervals);
    return intervals;
};

export const part1 = (input = defaultInput, targetY = 2000000) => {
    const { points, sensors, sensorsToBeacons } = parseInput(input);
    const intervals = getIntervalsForRow(sensors, sensorsToBeacons, targetY);
    let numPointsInsideIntervals = intervals.reduce((acc, interval) => acc + interval.size(), 0);
    const sensorsOrBeaconsInIntervals = Object.values(points)
        .filter(point => point.y === targetY && intervals.some(interval => interval.contains(point.x)))

    return numPointsInsideIntervals - sensorsOrBeaconsInIntervals.length;
};

export const part2 = (input = defaultInput, maxCoord = 4000000) => {
    const { sensors, sensorsToBeacons } = parseInput(input);

    // Loop over the rows
    for (let y = 0; y < maxCoord; y += 1) {
        const intervals = getIntervalsForRow(sensors, sensorsToBeacons, y);

        // Process the intervals in this row
        let x = 0;
        while (x < maxCoord) {
            const containingInterval = intervals.find(interval => interval.contains(x));

            // If no intervals contain this x,y coordinate, we assume this point
            // is where the distress beacon must be.
            if (!containingInterval) {
                return (x * 4000000) + y;
            }

            x = containingInterval.b + 1;
        }
    }
}
