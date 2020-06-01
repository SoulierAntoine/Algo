let Graph = require('./environment/graph');
let Cell = require('./environment/cell');

const ALGO = {
    ASTAR: {
        solve: (graph) => {
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

                        // What will be inserted in open needs to be a new reference
                        // Otherwise we would edit what's already in open
                        let candidate = node.copy();

                        // Set which node we are from
                        candidate.from = current;

                        // Set the distance for this node from the start
                        // g(n') = g(n) + c(n, n')
                        candidate.distance = current.distance + distance;

                        // If node n' is already in open
                        if (graph.open.find(c => c.id === candidate.id) !== undefined) {
                            // If node n' is better than a node with similar id generated previously, replace it with n'
                            const remove = graph.check(graph.open, candidate);
                            if (remove !== -1) {
                                graph.open.splice(remove, 1);
                                graph.add(graph.open, candidate);
                            }
                        } else {
                            // Insert in open (in ascending order depending on f(n))
                            graph.add(graph.open, candidate);
                        }
                    }
                }
            }

            return current;
        },
    },
    GENETIC: {
        construct: (generator, evaluator, selector, crossover, mutator, stop, chessboardSize, populationSize) => {
            this.generator = generator;
            this.evaluator = evaluator;
            this.selector = selector;
            this.crossover = crossover;
            this.mutator = mutator;
            this.stop = stop;
            this.chessboardSize = chessboardSize;
            this.populationSize = populationSize;
            return this;
        },
        GENERATOR: (populationSize, chessboardSize) => {
            return Array.from(Array(populationSize), (_) => {
                let genes = Array.from(Array(chessboardSize), (_, i) => ++i);

                return Array.from(Array(chessboardSize), (_) => {
                    const index = ALGO.GENETIC.getRandom(genes.length - 1);
                    return genes.splice(index, 1)[0];
                });
            });
        },
        SELECTOR: {
            elitist: (solutions) => {

            },
            note: (solutions) => {
                const notes = solutions.map(this.evaluator);
                const total = notes.reduce((acc, cur) => acc + cur);
                // const percents = notes.map(n => (n / total) * 100);
                const percents = notes.map(n => (n / total) * 100);
                console.log('percent: ', percents);

                let random = ALGO.GENETIC.getRandom(100);
                let cumulative = 0;
                for (let i = 0; i < percents.length; i++) {
                    cumulative += percents[i];
                    if (random < cumulative)
                        return percents[i];
                }

                return percents.sort((a,b) => b - a)[0];
            },
            rank: (solutions) => {

            },
            tournament: (solutions) => {

            }
        },
        EVALUATOR: (solution) => {
            return solution.reduce((collisions, position, positionIndex, src) => {
                // If we are at the last position, all possible collisions have been calculated
                if (positionIndex === src.length - 1) return collisions;

                // Check each next element
                collisions += src.reduce((acc, cur, index) => {
                    // Still need this for the index to increase
                    if (index <= positionIndex) return acc;
                    // Check rows
                    if (position === cur) return ++acc;
                    // Check diagonals
                    if ((Math.abs(position - cur)) === Math.abs(positionIndex - index)) return ++acc;

                    return acc;
                }, 0);

                return collisions;
            }, 0)
        },
        CROSSOVER: (solutionA, solutionB) => {

        },
        MUTATOR: (solution) => {

        },
        STOP: {
            quality: (solutions) => {

            },
            iteration: (max, current) => {

            },
            plateau: (solutions, threshold) => {

            }
        },
        solve: (GA) => {
            if (Object.keys(GA).length === 0 || (GA.chessboardSize < 3 || GA.chessboardSize > 9))
                return -1;

            /*
                ideally a node is represented as a string (representing its genetic code, it's simpler to visualize crossover / mutation)
                generate randomly a population k
                until an "end criteria" is met (optional) or after certain number of iterations
                    new_pop = []
                    for each element n of the population,
                        get the one that minimize F(n) (we're looking to have as low collisions as possible, maximum being 28)
                            ie we get all the collision possible, and for each, we normalize and it gives us the %age of being selected
                            eg F(n) for several nodes gives 24, 23, 20, 11, we divide 24 by the sum of the other, giving 31%
                        get another n' that minimize F(n)
                        create another n* that comes from a crossover between n and n'
                        small pbity of adding a mutation to n*
                        add n* to new_pop
                    population = new_pop
                return the n in pop with best F(n)
             */
            // const population = generator()
        },
        getRandom: (max) => {
            return Math.floor(Math.random() * Math.floor(max));
        },
        displaySolution: (solution) => {

        }
    },
    DIJKSTRA: {
        // @deprecated
        solve: (graph) => {
            let current;
            do {
                current = graph.open[0];
                const remove = graph.open.findIndex(c => c.id === current.id);
                graph.open.splice(remove, 1);
                graph.closed.push(current);

                for ([node, distance] of current.neighbors) {
                    if (graph.closed.find(c => c.id === node.id) === undefined) {
                        node.from = current;
                        node.distance = current.distance + distance;
                        graph.add(graph.open, node);
                    }
                }
            } while (!current.isGoal);

            return current;
        }
    },
    GRAPH: {
        displaySolution: (solution) => {
            let current = solution;
            let path = [solution.id];

            do {
                path.push(current.from.id);
                current = current.from;
            } while (current.from !== null);

            return path.join(" - ");
        },
        // should find shortest path
        getGraph: () => {
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
        // n2 should not be part of the solution
        getGraph2: () => {
            let n0 = new Cell("n0"); n0.heuristic = 9;
            n0.distance = 0;
            n0.isStart = true;

            let n1 = new Cell("n1"); n1.heuristic = 2;
            let n2 = new Cell("n2"); n2.heuristic = 2;
            let n3 = new Cell("n3"); n3.heuristic = 5;
            let n4 = new Cell("n4"); n4.heuristic = 3;
            let n5 = new Cell("n5"); n5.heuristic = 2;

            let n6 = new Cell("n6"); n6.heuristic = 0;
            n6.isGoal = true;

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
        },
        // n3 should never be visited (not in closed)
        getGraph3: () => {
            let n0 = new Cell("n0"); n0.heuristic = 9;
            n0.distance = 0;
            n0.isStart = true;

            let n1 = new Cell("n1"); n1.heuristic = 8;
            let n2 = new Cell("n2"); n2.heuristic = 12;
            let n3 = new Cell("n3"); n3.heuristic = 15;
            let n4 = new Cell("n4"); n4.heuristic = 7;
            let n5 = new Cell("n5"); n5.heuristic = 5;
            let n6 = new Cell("n6"); n6.heuristic = 3;

            let n7 = new Cell("n7"); n7.heuristic = 0;
            n7.isGoal = true;

            // Set neighbors
            n0.neighbors = new Map([[n1, 1]]);
            n1.neighbors = new Map([[n0, 1], [n2, 2], [n4, 6]]);
            n2.neighbors = new Map([[n1, 2], [n3, 3]]);
            n3.neighbors = new Map([[n2, 3], [n7, 12]]);
            n4.neighbors = new Map([[n1, 6], [n5, 2]]);
            n5.neighbors = new Map([[n4, 2], [n6, 3]]);
            n6.neighbors = new Map([[n5, 3], [n7, 1]]);
            n7.neighbors = new Map([[n6, 1], [n3, 12]]);

            const open = [n0];
            const closed = [];

            return new Graph(open, closed);
        }
    }
};

/* const graph = ALGO.GRAPH.getGraph();
const solution = ALGO.ASTAR.solve(graph);
console.log('solution: ', ALGO.GRAPH.displaySolution(solution)); */

const chessboardSize = 8;
const populationSize = 100;
const generator = ALGO.GENETIC.GENERATOR;
const evaluator = ALGO.GENETIC.EVALUATOR;
const crossover = ALGO.GENETIC.CROSSOVER;
const mutator = ALGO.GENETIC.MUTATOR;

const selector = ALGO.GENETIC.SELECTOR.note;
const stop = [ALGO.GENETIC.STOP.quality, ALGO.GENETIC.STOP.iteration];

const GA = ALGO.GENETIC.construct(generator, evaluator, selector, crossover, mutator, stop, chessboardSize, populationSize);

const test = generator(populationSize, chessboardSize);
console.log(selector(test));

const solution = ALGO.GENETIC.solve(GA);


/* const test = [1,5,3,6,4,1,7,8];
    // -> 8

+ ----------------------------- +
|   |   |   |   |   |   |   | x |
|-------------------------------|
|   |   |   |   |   |   | x |   |
|-------------------------------|
|   |   |   | x |   |   |   |   |
|-------------------------------|
|   | x |   |   |   |   |   |   |
|-------------------------------|
|   |   |   |   | x |   |   |   |
|-------------------------------|
|   |   | x |   |   |   |   |   |
|-------------------------------|
|   |   |   |   |   |   |   |   |
|-------------------------------|
| x |   |   |   |   | x |   |   |
+ ----------------------------- + */
