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
                    const index = ALGO.GENETIC.getRandom(0, genes.length);
                    return genes.splice(index, 1)[0];
                });
            });
        },
        SELECTOR: {
            // Choose the best solutions
            elitist: (solutions) => {
                let elite = solutions
                    .map((s, i) => ({ index: i, note: this.evaluator(s)}))
                    .sort((a,b) => b.note - a.note)
                [0];

                return elite.index;
            },
            // The best solution is the most likely to be selected
            note: (solutions, chessboardSize) => {
                const notes = solutions.map(this.evaluator);
                let percents = notes.map(n => n * 100 / ALGO.GENETIC.getMaxPossibleCollisions(chessboardSize));

                let cumulative = 0;
                const sum = percents.reduce((acc, el) => acc + el, 0);
                percents = percents.map(el => (cumulative = el + cumulative));
                const random = Math.random() * sum;

                return percents.filter(el => el <= random).length;
            },
            // Select randomly tournamentSize element of the populations, return the best
            tournament: (solutions, tournamentSize) => {
                const randomIndexes = [];
                const selected = Array.from(Array(tournamentSize), (_, i) => {
                    let random;
                    do  { random = ALGO.GENETIC.getRandom(0, solutions.length);
                    } while (randomIndexes.includes(random));
                    randomIndexes.push(random);
                    return solutions[random];
                });

                const champion = selected
                    .map((s, i) => ({ index: i, note: this.evaluator(s) }))
                    .sort((a, b) => b.note - a.note)
                [0];

                return champion.index;
            }
        },
        EVALUATOR: (solution) => {
            // Count the number of avoided collisions, the goal is to maximize this value
            return solution.reduce((collisions, position, positionIndex, src) => {
                // If we are at the last position, all possible collisions have been calculated
                if (positionIndex === src.length - 1) return collisions;

                // Check each next element
                collisions -= src.reduce((acc, cur, index) => {
                    // Still need this for the index to increase
                    if (index <= positionIndex) return acc;
                    // Check rows
                    if (position === cur) return ++acc;
                    // Check diagonals
                    if ((Math.abs(position - cur)) === Math.abs(positionIndex - index)) return ++acc;

                    return acc;
                }, 0);

                return collisions;
            }, ALGO.GENETIC.getMaxPossibleCollisions(solution.length))
        },
        CROSSOVER: (solutionA, solutionB) => {
            let separator = ALGO.GENETIC.getRandom(0, solutionA.length);
            return [].concat(solutionA.slice(0, separator), solutionB.slice(separator, solutionB.length));
        },
        MUTATOR: (solution) => {
            const index = ALGO.GENETIC.getRandom(0, solution.length);
             // Random integer between 1 and less than 9
            solution[index] = ALGO.GENETIC.getRandom(1, solution.length + 1);
            return solution;
        },
        STOP: {
            quality: (solutions) => {
                const best = solutions.find(s => this.evaluator(s) === ALGO.GENETIC.getMaxPossibleCollisions(s.length));
                return best !== undefined;
            },
            iteration: (max, current) => {
                return current >= max;
            },
            plateau: (solutions, threshold) => {
                let plateau = solutions
                    .map(this.evaluator)
                    .sort((a,b) => b.note - a.note)
                    .slice(0, threshold);

                return plateau.every(s => s === plateau[0]);
            }
        },
        solve: (GA, maxIteration, miscellaneous) => {
            if (Object.keys(GA).length === 0)
                return -1;

            let stop = false;
            let iteration = 0;
            let population = GA.generator(GA.populationSize, GA.chessboardSize);

            console.log('running GA...');
            console.time("run");
            do {
                iteration++;
                console.log('generation: ', iteration);
                let newPopulation = [];

                for (const p of population) {
                    const indexA = select(GA.selector.name);
                    const bestA = population[indexA];
                    const tmp = population.splice(indexA, 1);

                    const indexB = select(GA.selector.name);
                    const bestB = population[indexB];

                    let added = GA.crossover(bestA, bestB);
                    const percent = ALGO.GENETIC.getRandom(0,100);
                    if (percent < 25)
                        added = GA.mutator(added);
                    newPopulation.push(added);
                    population.push(tmp[0]);
                }
                population = newPopulation;
                GA.stop.forEach(s => {
                    if (stop) return;
                    switch (s.name) {
                        case "quality":     stop = s(population); break;
                        case "iteration":   stop = s(maxIteration, iteration); break;
                        case "plateau":     stop = s(population, miscellaneous.plateau); break;
                    }
                })
            } while (!stop && iteration < maxIteration);
            console.timeEnd("run");
            console.log('stopped after ', iteration, ' iteration(s)');

            const bests = population
                .map((s,i) => ({ note: GA.evaluator(s), index: i}))
                .sort((a,b) => b.note - a.note);

            return population[bests[0].index];

            function select(name) {
                switch (name) {
                    case "elitist":     return GA.selector(population);
                    case "note":        return GA.selector(population, GA.chessboardSize);
                    case "tournament":  return GA.selector(population, miscellaneous.tournamentSize);
                }
            }
        },
        getRandom: (min, max) => {
            // Get a random value equals or greater than min, and lower than max.
            min = Math.ceil(min);
            max = Math.floor(max);
            return  Math.floor(Math.random() * (max - min)) + min;
        },
        getMaxPossibleCollisions: (chessboardSize) => {
            return Math.floor((chessboardSize * 7) / 2);
        },
        displaySolution: (solution) => {

            console.log('solution: ', solution, ' - ', this.evaluator(solution), '/', ALGO.GENETIC.getMaxPossibleCollisions(this.chessboardSize));

            // Upper and lower border
            let border = "+ ";
            for (let i = 0; i < solution.length - 1; i++) { border += "----" }
            border += "- +\n";

            let separator = "|-";
            for (let i = 0; i < solution.length - 1; i++) { separator += "----" }
            separator += "--|\n";

            let display = "";
            let k = solution.length;

            display += border;

            for (let i = 1; i <=  (2 * solution.length - 1); i++) {
                if (i % 2 === 1) {
                    for (let j = 0; j < solution.length; j++) {
                        if (j === 0) display += "|";
                        if (j === solution.length) display += "  |";
                        if (solution[j] === k) display += " ¤ |";
                        else display +=  "   |";
                    }
                    k--;
                } else {
                    display += "\n";
                    display += separator;
                }
            }

            display += "\n";
            display += border;
            console.log(display);
            return display;
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

let solution;
const graph = ALGO.GRAPH.getGraph();
solution = ALGO.ASTAR.solve(graph);
console.log('solution: ', ALGO.GRAPH.displaySolution(solution));

const maxIteration = 100;
const populationSize = 100;
const chessboardSize = 8;
const miscellaneous = { tournamentSize: Math.floor(populationSize / 5), plateau: 3 };

const generator = ALGO.GENETIC.GENERATOR;
const evaluator = ALGO.GENETIC.EVALUATOR;
const crossover = ALGO.GENETIC.CROSSOVER;
const mutator = ALGO.GENETIC.MUTATOR;
const selector = ALGO.GENETIC.SELECTOR.elitist;
const stop = [ALGO.GENETIC.STOP.quality];

const GA = ALGO.GENETIC.construct(generator, evaluator, selector, crossover, mutator, stop, chessboardSize, populationSize);
solution = ALGO.GENETIC.solve(GA, maxIteration, miscellaneous);
ALGO.GENETIC.displaySolution(solution);
