import defaultInput from './input.js';

// AST node constructors
const Bool = value => ({ type: 'Bool', value });
const Num = val => ({ type: 'Number', value: Number(val) });
const Ident = val => ({ type: 'Ident', value: val });
const BinOp = (op, left, right) => ({ type: 'BinOp', operator: op, left, right });
const Variable = (name) => ({ type: 'Variable', name });

// Parse input to an object mapping identifier names to AST nodes
const parseInput = input => {
    const identifiers = {};

    for (const line of input.split('\n')) {
        const [ident, value] = line.split(': ');
        const tokens = value.split(' ');
        let token = tokens.shift();
        let node;

        while (token) {
            if (!isNaN(token)) {
                node = Num(token);
            } else if (['+', '-', '*', '/', '='].includes(token)) {
                const next = tokens.shift();
                const right = isNaN(next) ? Ident(next) : Num(next);
                node = BinOp(token, node, right);
            } else {
                node = Ident(token);
            }

            token = tokens.shift();
        }

        identifiers[ident] = node;
    }

    return identifiers;
};

/**
 * Evaluate node to a result.
 *
 * @param {object} node AST node
 * @param {object} identifiers Mapping of identifier names to AST nodes
 * @return {number|boolean}
 */
const evaluate = (node, identifiers) => {
    if (node.type === 'Number') {
        return node.value;
    }

    if (node.type === 'Ident') {
        return evaluate(identifiers[node.value], identifiers);
    }

    if (node.type === 'BinOp') {
        const left = evaluate(node.left, identifiers);
        const right = evaluate(node.right, identifiers);

        switch (node.operator) {
            case '+': return left + right;
            case '-': return left - right;
            case '*': return left * right;
            case '/': return left / right;
            case '=': return left === right;
        }
    }

    throw new Error(`Unexpected node type: ${node.type}`);
};

const isNode = value => typeof value?.type !== 'undefined';
const isScalar = value => typeof value === 'number' || typeof value === 'boolean';
const toScalarNode = value =>
    typeof value === 'number' ? Num(value) : Bool(value);

/**
 * Walk a node, reducing to a scalar value if possible. Similar to evaluate,
 * but designed to work with variables.
 *
 * @param {object} node AST node
 * @param {object} state Object mapping identifiers to AST nodes
 * @return {object|number|boolean} Scalar value or AST node
 */
const walk = (node, state) => {
    if (node.type === 'Variable') {
        return node;
    }

    if (node.type === 'Bool' || node.type === 'Number') {
        return node.value;
    }

    if (node.type === 'Ident') {
        return walk(state[node.value], state);
    }

    if (node.type === 'BinOp') {
        const left = walk(node.left, state);
        const right = walk(node.right, state);

        if (isNode(left) || isNode(right)) {
            return node;
        }

        switch (node.operator) {
            case '+': return left + right;
            case '-': return left - right;
            case '*': return left * right;
            case '/': return left / right;
            case '=': return left === right;
        }
    }

    throw new Error(`Unexpected node type: ${node.type}`);
};

/**
 * Attempt to unify two nodes to the same value, returning a new state where
 * that condition is met (if possible).
 *
 * @param {object} state Object mapping identifiers to AST nodes
 * @param {object} a First AST node
 * @param {object} b Second AST node
 * @return {object|undefined} New state where a and b are equal, or `undefined`
 */
const unify = (state, a, b) => {
    a = walk(a, state);
    b = walk(b, state);

    if (a === b) {
        // Both values must be equal scalars. We've reached our goal. Return state.
        return state;
    }

    if (isScalar(a) && isNode(b)) {
        // Keep scalars on the right-hand side to simplify conditional checks.
        return unify(state, b, toScalarNode(a));
    }

    if (a.type === 'Variable') {
        // Assign b to a
        return {
            ...state,
            [a.name]: isScalar(b) ? toScalarNode(b) : b,
        };
    }

    if (b.type === 'Variable') {
        // Assign a to b
        return {
            ...state,
            [b.name]: isScalar(a) ? toScalarNode(a) : a,
        };
    }

    if (a.type === 'BinOp') {
        if (a.operator === '=' && b === true) {
            // Handle equality
            return unify(state, a.left, a.right);
        }

        // For other operators, rearrange the equation such that the
        // scalar values are shifted into the left-hand side (a), and
        // the variable is shifted into the right-hand side (b).
        //
        // Example: x + 2 = 3 <--> 3 - 2 = x
        const left = walk(a.left, state);
        const right = walk(a.right, state);
        const variable = isNode(left) ? left : right;
        const scalar = isScalar(left) ? left : right;

        if (a.operator === '+') {
            return unify(
                state,
                BinOp('-', toScalarNode(b), toScalarNode(scalar)),
                variable
            );
        }

        if (a.operator === '-') {
            if (isScalar(left)) {
                return unify(
                    state,
                    BinOp('-', toScalarNode(scalar), toScalarNode(b)),
                    variable
                );
            } else {
                return unify(
                    state,
                    BinOp('+', toScalarNode(b), toScalarNode(scalar)),
                    variable
                );
            }
        }

        if (a.operator === '*') {
            return unify(
                state,
                BinOp('/', toScalarNode(b), toScalarNode(scalar)),
                variable
            );
        }

        if (a.operator === '/') {
            if (isScalar(left)) {
                return unify(
                    state,
                    BinOp('/', toScalarNode(scalar), toScalarNode(b)),
                    variable
                );
            } else {
                return unify(
                    state,
                    BinOp('*', toScalarNode(b), toScalarNode(scalar)),
                    variable
                );
            }
        }

    }
};

export const part1 = (input = defaultInput) => {
    const identifiers = parseInput(input);
    return evaluate(identifiers.root, identifiers);
};

export const part2 = (input = defaultInput) => {
    const identifiers = parseInput(input);
    identifiers.root = BinOp('=', identifiers.root.left, identifiers.root.right);
    identifiers.humn = Variable('humn');
    const unified = unify(identifiers, identifiers.root, Bool(true));
    return evaluate(unified.humn, unified);
};
