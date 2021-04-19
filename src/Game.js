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

const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 10;

const TICK_EVERY_MS = 1500;

const EMPTY_BOARD = () => {
    const board = [];
    for (let i = 0; i < BOARD_HEIGHT; i++) {
        const row = [];
        for (let j = 0; j < BOARD_WIDTH; j++) {
            row[j] = ' ';
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

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            started: false,
            paused: false,
            board: EMPTY_BOARD(),
            currentBlock: NO_BLOCK
        };

    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
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
    }

    pause = () => {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.setState({ paused: true });
    }

    resume = () => {
        this.setState({ paused: false });
        this.intervalId = setInterval(this.tick, TICK_EVERY_MS);
    }

    tick = () => {
        console.log('tick');
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
