export default (x, y) => {
    if (typeof y === 'undefined') {
        y = x.y;
        x = x.x;
    }

    return `${x},${y}`;
};
