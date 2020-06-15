class Graph {
    constructor(open, closed) {
        this._open = open;
        this._closed = closed;
    }

    // Add nodes to the target, sorted in ascending order by f(n)
    add(target, value) {
        const insert = target.findIndex(c => c.evaluation > value.evaluation);
        target.splice((insert !== -1) ? insert : target.length, 0, value);
    }

    // Check if target contains a node with a similar id of the value
    // If so, check if it is a better node by checking its evaluation function
    // If so, returns the index that needs to be replaced
    // Else, returns -1
    check(target, value) {
        const visited = target.findIndex(c => c.id === value.id);
        if (visited === -1) return -1;

        const similar = target[visited];
        if (similar.evaluation < value.evaluation) return -1;

        return visited;
    }

    get open() { return this._open; }

    get closed() { return this._closed; }
}

module.exports = Graph;
