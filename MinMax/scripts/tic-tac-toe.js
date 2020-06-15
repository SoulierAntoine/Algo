class TicTacToe {

    constructor(canvas, context, player, lineColor, canvasSize) {
        this.canvas = canvas;
        this.context = context;
        this.player = player;
        this.lineColor = lineColor;
        this.sectionSize = canvasSize / 3;
    }

    addPlayingPieceWithCell(cellNum) {
        this.player = (this.player === 1) ? 2 : 1;

        switch (cellNum) {
            case 9:
                this.addPlayingPiece({x: (this.sectionSize * 2) + 1, y: (this.sectionSize * 2) + 1});
                break;
            case 8:
                this.addPlayingPiece({x: this.sectionSize + 1, y: (this.sectionSize * 2) + 1});
                break;
            case 7:
                this.addPlayingPiece({x: 0, y: (this.sectionSize * 2) + 1});
                break;
            case 6:
                this.addPlayingPiece({x: (this.sectionSize * 2) + 1, y: this.sectionSize + 1});
                break;
            case 5:
                this.addPlayingPiece({x: this.sectionSize + 1, y: this.sectionSize + 1});
                break;
            case 4:
                this.addPlayingPiece({x: 0, y: this.sectionSize + 1});
                break;
            case 3:
                this.addPlayingPiece({x: (this.sectionSize * 2) + 1, y: 0});
                break;
            case 2:
                this.addPlayingPiece({x: this.sectionSize + 1, y: 0});
                break;
            case 1:
            default:
                this.addPlayingPiece({x: 0, y: 0});
                break;
        }
        this._drawLines(10, this.lineColor);
    }

    addPlayingPiece(mouse) {
        let xCoordinate;
        let yCoordinate;

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                xCoordinate = x * sectionSize;
                yCoordinate = y * sectionSize;

                if (
                    mouse.x >= xCoordinate && mouse.x <= xCoordinate + this.sectionSize &&
                    mouse.y >= yCoordinate && mouse.y <= yCoordinate + this.sectionSize
                ) {

                    this._clearPlayingArea(xCoordinate, yCoordinate);

                    if (this.player === 1) {
                        this._drawX(xCoordinate, yCoordinate);
                    } else {
                        this._drawO(xCoordinate, yCoordinate);
                    }
                }
            }
        }
    }

    _clearPlayingArea(xCoordinate, yCoordinate) {
        this.context.fillStyle = "#fff";
        this.context.fillRect(
            xCoordinate,
            yCoordinate,
            this.sectionSize,
            this.sectionSize
        );
    }

    _drawO(xCoordinate, yCoordinate) {
        let halfSectionSize = (0.5 * this.sectionSize);
        let centerX = xCoordinate + halfSectionSize;
        let centerY = yCoordinate + halfSectionSize;
        let radius = (sectionSize - 100) / 2;
        let startAngle = 0;
        let endAngle = 2 * Math.PI;

        this.context.lineWidth = 10;
        this.context.strokeStyle = "#01bBC2";
        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, startAngle, endAngle);
        this.context.stroke();
    }

    _drawX(xCoordinate, yCoordinate) {
        this.context.strokeStyle = "#f1be32";

        this.context.beginPath();

        let offset = 50;
        this.context.moveTo(xCoordinate + offset, yCoordinate + offset);
        this.context.lineTo(xCoordinate + this.sectionSize - offset, yCoordinate + this.sectionSize - offset);

        this.context.moveTo(xCoordinate + offset, yCoordinate + this.sectionSize - offset);
        this.context.lineTo(xCoordinate + this.sectionSize - offset, yCoordinate + offset);

        this.context.stroke();
    }

    _drawLines(lineWidth, strokeStyle) {
        let lineStart = 4;
        let lineLenght = canvasSize - 5;
        this.context.lineWidth = lineWidth;
        this.context.lineCap = 'round';
        this.context.strokeStyle = strokeStyle;
        this.context.beginPath();

        // Horizontal lines
        for (let y = 1; y <= 2; y++) {
            this.context.moveTo(lineStart, y * sectionSize);
            this.context.lineTo(lineLenght, y * sectionSize);
        }

        // Vertical lines
        for (let x = 1; x <= 2; x++) {
            this.context.moveTo(x * sectionSize, lineStart);
            this.context.lineTo(x * sectionSize, lineLenght);
        }

        this.context.stroke();
    }

    _getCanvasMousePosition(event) {
        let rect = this.canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        }
    }
}
