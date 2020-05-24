class Graph {
    constructor(open, closed) {
        this._open = open;
        this._closed = closed;
    }

    // Add nodes to the target, sorted in ascending order by f(n)
    add(target, value) {
        const insert = target.findIndex(c => this._eval(c, value));
        target.splice(insert, 0, value);
    }


    // f(n) => g(n) + h(n)
    // Get an estimate for getting to the goal from node n
    // TODO: add heuristic h(n)
    _eval(cell, value) {
        return cell.distance > value.distance;
    }

    get open() { return this._open; }

    get closed() { return this._closed; }
}

module.exports = Graph;
