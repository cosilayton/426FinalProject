import React from 'react';

const SHAPES = {
    SQUARE_2_2: [
        [ 'x', 'x' ],
        [ 'x', 'x' ]
    ],
    BAR_1_3: [
        [ 'x', 'x', 'x' ]
    ],
    L_3_2: [
        [ 'x', ' ' ],
        [ 'x', ' ' ],
        [ 'x', 'x' ]
    ]
};

const COLORS_COUNT = 4;
const SHAPE_TYPES = Object.keys(SHAPES);

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 15;

const TICK_EVERY_MS = 1500;
const BLANK_SPACE = ' ';

const EMPTY_BOARD = () => {
    const board = [];
    for (let i = 0; i < BOARD_HEIGHT; i++) {
        const row = [];
        for (let j = 0; j < BOARD_WIDTH; j++) {
            row[j] = BLANK_SPACE;
        }
        board.push(row);
    }
    return board;
}

const NO_BLOCK = { shape: null, color: null, x: null, y: null };

// Getting a random number between 0 (inclusive) and max (exclusive)
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// React.Component not a React.PureComponent, so that it re-renders when we
// update the 'board' and 'currentBlock' in-place.
class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            started: false,
            paused: false,
            board: EMPTY_BOARD(),
            currentBlock: NO_BLOCK
        };

        // additional fields, not part of component's React state
        this.intervalId = null;
        this.keyboardEnabled = false;
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
        this.disableKeyboard();
    }

    // Color of a new shape
    randomColor() {
        return 1 + getRandomInt(COLORS_COUNT - 1);
    }

    // Calculate initial x coord for a new shape, starting from 0.
    initialPosition(shapeType) {
        const shape = SHAPES[shapeType];
        const shapeWidth = shape[0].length;
        return getRandomInt(BOARD_WIDTH - shapeWidth + 1);
    }

    // Render the block or clear it.
    renderBlock(board, currentBlock, color) {
        const { x, y } = currentBlock;
        const rows = SHAPES[currentBlock.shape];
        for (var i = 0; i < rows.length; i++) {
            const row = rows[i];
            for (var j = 0; j < row.length; j++) {
                if (row[j] !== ' ') {
                    board[y + i][x + j] = color;
                }
            }
        }
    }

    nextBlock() {
        const { board } = this.state;
        const shapeTypeIdx = getRandomInt(SHAPE_TYPES.length);
        const shapeType = SHAPE_TYPES[shapeTypeIdx];
        const currentBlock = {
            shape: shapeType,
            color: this.randomColor(),
            x: this.initialPosition(shapeType),
            y: 0
        };
        this.renderBlock(board, currentBlock, currentBlock.color);
        this.setState({ board, currentBlock });
    }

    start = () => {
        this.setState({ started: true });
        this.intervalId = setInterval(this.tick, TICK_EVERY_MS);
        this.nextBlock();
        this.enableKeyboard();
    }

    pause = () => {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.setState({ paused: true });
        this.disableKeyboard();
    }

    resume = () => {
        this.setState({ paused: false });
        this.intervalId = setInterval(this.tick, TICK_EVERY_MS);
        this.enableKeyboard();
    }

    moveBlock(deltaX, deltaY) {
        const { board, currentBlock } = this.state;
        this.renderBlock(board, currentBlock, BLANK_SPACE);
        currentBlock.x += deltaX;
        currentBlock.y += deltaY;
        this.renderBlock(board, currentBlock, currentBlock.color);
        this.setState({ board, currentBlock });
    }

    moveBlockDown() {
        const { board, currentBlock } = this.state;
        const shapeType = currentBlock.shape;
        const shape = SHAPES[shapeType];
        const shapeHeight = shape.length;
        const canMove = (currentBlock.y + shapeHeight < BOARD_HEIGHT);
        if (canMove) {
            this.moveBlock(0, +1);
        }
        return canMove;
    }

    moveBlockLeft() {
        const { board, currentBlock } = this.state;
        const canMove = (currentBlock.x > 0);
        if (canMove) {
            this.moveBlock(-1, 0);
        }
        return canMove;
    }

    moveBlockRight() {
        const { board, currentBlock } = this.state;
        const shapeType = currentBlock.shape;
        const shape = SHAPES[shapeType];
        const shapeWidth = shape[0].length;
        const canMove = (currentBlock.x + shapeWidth < BOARD_WIDTH);
        if (canMove) {
            this.moveBlock(+1, 0);
        }
        return canMove;
    }

    onKeyDown = (e) => {
        if (e.code === 'Space' || e.key === ' ') {
            // TODO: rotate the block
        }
        if (e.code === 'ArrowLeft' || e.key === 'ArrowLeft') {
            this.moveBlockLeft();
        }
        if (e.code === 'ArrowRight' || e.key === 'ArrowRight') {
            this.moveBlockRight();
        }
        if (e.code === 'ArrowRight' || e.key === 'ArrowRight') {
            // TODO: moveBlockRight
        }
        if (e.code === 'ArrowDown' || e.key === 'ArrowDown') {
            // TODO: drop the block
        }
    }

    enableKeyboard() {
        this.keyboardEnabled = true;
        window.addEventListener("keydown", this.onKeyDown);
    }

    disableKeyboard() {
        if (this.keyboardEnabled) {
            window.removeEventListener("keydown", this.onKeyDown);
        }
        this.keyboardEnabled = false;
    }

    tick = () => {
        if (this.moveBlockDown()) {
        } else {
            console.log('could not move, next block');
            this.nextBlock();
        }
    }

    render() {
        const { board, started, paused } = this.state;
        const can = {
            start: !started,
            pause: started && !paused,
            resume: paused
        };
        return (
            <div>
                <div className='controls'>
                    <button onClick={this.start} disabled={!can.start}>
                        Start
                    </button>
                    <button onClick={this.pause} disabled={!can.pause}>
                        Pause
                    </button>
                    <button onClick={this.resume} disabled={!can.resume}>
                        Resume
                    </button>
                </div>
                <table className='board'>
                  <tbody>
                    {board.map((row, j) => (
                        <tr key={j}>{row.map((color, i) => (<td key={i} className={`c${color}`}></td>))}</tr>
                    ))}
                  </tbody>
                </table>
            </div>
        );
    }
}

export default Game;
