class Cell {

    constructor(id) {
        this._id = id;
        this._distance = Number.POSITIVE_INFINITY;
        this._isStart = false;
        this._isGoal = false;
        this._from = null;

        // Used only in A*
        this._heuristic = null;
    }

    toString() {
        return `<${this._id} - ${this._distance}>`;
    }


    get id() { return this._id; }

    // h(n) => estimate of the cost from node n to goal
    get heuristic() { return this._heuristic; }
    set heuristic(value) { this._heuristic = value }


    get from() { return this._from; }
    set from(value) { this._from = value }

    // g(n) =>  cost of the best path found until now (from start to node n)
    get distance() { return this._distance; }
    set distance(value) { this._distance = value; }

    // transition(n) => return all successors nodes for node n
    get neighbors() { return this._neighbors; }
    set neighbors(value) { this._neighbors = value; }

    get isStart() { return this._isStart; }
    set isStart(value) { this._isStart = value; }

    // goal(n) => return true if goal is reached for node n
    get isGoal() { return this._isGoal; }
    set isGoal(value) { this._isGoal = value; }
}

module.exports = Cell;
