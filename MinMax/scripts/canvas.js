'use strict';


/**
 * Set up
 */
let player = 1;
let lineColor = "#ddd";

let canvas = document.getElementById('game');
let context = canvas.getContext('2d');

let canvasSize = 500;
let sectionSize = canvasSize / 3;
canvas.width = canvasSize;
canvas.height = canvasSize;
context.translate(0.5, 0.5);

/**
 * Load Game
 */
const Game = new TicTacToe(canvas, context, player, lineColor, canvasSize);
Game._drawLines(10, lineColor);

canvas.addEventListener('mouseup', function (event) {
    Game.player = (Game.player === 1) ? 2 : 1;
    let canvasMousePosition = Game._getCanvasMousePosition(event);
    Game.addPlayingPiece(canvasMousePosition);
    Game._drawLines(10, lineColor);

    // TODO: the AI should start playing here...
    //  Alpha-beta pruning
});


