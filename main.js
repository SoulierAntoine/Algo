let Graph = require('./environment/graph');
let Cell = require('./environment/cell');

const ALGO = {
    ASTAR: {
        solve: function (graph) {
            let current;
            do {
                current = graph.open[0];
                const remove = graph.open.findIndex(c => c.id === current.id);
                graph.open.splice(remove, 1);
                graph.closed.push(current);

                for ([node, distance] of current.neighbors) {
                    if (graph.closed.find(c => c.id === node.id) === undefined) {
                        // Set which node we are from
                        node.from = current;
                        // Set the distance from the start
                        node.distance = current.distance + distance;
                        // Insert (from smallest to biggest distance)
                        graph.add(graph.open, node);
                    }
                }
            } while (!current.isGoal);

            return current;
        },
    },
    DIJKSTRA: {
        solve: function (graph) {
            let current = graph.open[0];

            while (!current.isGoal) {
                // Always treat the first node in open, since it is inserted in ascending order
                current = graph.open[0];

                // Remove current from open nodes and add it to closed nodes
                graph.open.shift();
                graph.closed.push(current);

                // For each successors node n' and distance c(n, n')
                for ([node, distance] of current.neighbors) {

                    // Only search for nodes that has not been visited previously (contained in close)
                    if (graph.closed.find(c => c.id === node.id) === undefined) {

                        // Set which node we are from
                        node.from = current;

                        // Set the distance for this node from the start
                        // g(n') = g(n) + c(n, n')
                        node.distance = current.distance + distance;

                        // Insert (from smallest to biggest distance)
                        graph.add(graph.open, node);
                    }
                }
            }

            return current;
        }
    },
    GRAPH: {
        displaySolution: function(solution) {
            let current = solution;
            let path = [solution.id];

            do {
                path.push(current.from.id);
                current = current.from;
            } while (current.from !== null);

            return path.join(" - ");
        },
        getGraph: function () {
            // Create instances
            let S = new Cell("S");

            let A = new Cell("A");
            let B = new Cell("B");
            let C = new Cell("C");
            let D = new Cell("D");
            let F = new Cell("F");
            let G = new Cell("G");
            let H = new Cell("H");
            let I = new Cell("I");
            let J = new Cell("J");
            let K = new Cell("K");
            let L = new Cell("L");

            let E = new Cell("E");

            // Set neighbors
            S.neighbors = new Map([[A, 7], [B, 2], [C, 3]]);
            S.distance = 0;
            S.isStart = true;

            A.neighbors = new Map([[S, 7], [B, 3], [D, 4]]);
            B.neighbors = new Map([[S, 2], [D, 4], [H, 1]]);
            C.neighbors = new Map([[S, 3], [L, 2]]);
            F.neighbors = new Map([[D, 5], [H, 3]]);
            D.neighbors = new Map([[A, 4], [B, 4], [F, 5]]);
            G.neighbors = new Map([[H, 2], [E, 2]]);
            H.neighbors = new Map([[B, 1], [G, 2]]);
            I.neighbors = new Map([[L, 4], [K, 4], [J, 6]]);
            J.neighbors = new Map([[L, 4], [I, 6], [K, 4]]);
            K.neighbors = new Map([[I, 4], [J, 4], [E, 5]]);
            L.neighbors = new Map([[C, 2], [I, 4], [J, 4]]);

            E.neighbors = new Map([[G, 2], [K, 5]]);
            E.isGoal = true;

            // Set graph
            const open = [S];
            const closed = [];

            return new Graph(open, closed);
        },
        getGraph2: function() {
            // Create instances
            let n0 = new Cell("n0"); n0.heuristic = 9;
            n0.isStart = true;

            let n1 = new Cell("n1"); n1.heuristic = 2;
            let n2 = new Cell("n2"); n2.heuristic = 2;
            let n3 = new Cell("n3"); n3.heuristic = 5;
            let n4 = new Cell("n4"); n4.heuristic = 3;
            let n5 = new Cell("n5"); n5.heuristic = 2;

            let n6 = new Cell("n6"); n6.heuristic = 0;
            n6.isGoal = true;

            // Set neighbors
            n0.neighbors = new Map([[n3, 2], [n2, 4], [n1, 3]]);
            n1.neighbors = new Map([[n0, 3], [n5, 7]]);
            n2.neighbors = new Map([[n0, 4], [n3, 1]]);
            n3.neighbors = new Map([[n0, 2], [n2, 1], [n4, 1]]);
            n4.neighbors = new Map([[n3, 1], [n2, 2], [n6, 4]]);
            n5.neighbors = new Map([[n1, 7], [n6, 4]]);
            n6.neighbors = new Map([[n4, 4], [n5, 4]]);

            // Set graph
            const open = [n0];
            const closed = [];

            return new Graph(open, closed);
        }
    }
}

const graph = ALGO.GRAPH.getGraph();
// graph.add(graph.open, new Cell("test"));
// let a = new Call("test2"); a.distance = 4;
// graph.add(graph.open, a);

const solution = ALGO.DIJKSTRA.solve(graph);
console.log('solution: ', ALGO.GRAPH.displaySolution(solution));
