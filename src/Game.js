import React from 'react';

import ApiGames from './api/Games';

import Alert from './Alert';

const SHAPES = {
    SQUARE_2_2: [
        [ 'x', 'x' ],
        [ 'x', 'x' ]
    ],
    BAR_3_1: [
        [ 'x', 'x', 'x' ]
    ],
    BAR_1_3: [
        [ 'x' ],
        [ 'x' ],
        [ 'x' ]
    ],
    E_3_2: [
        [ ' ', 'x', ' ' ],
        [ 'x', 'x', 'x' ]
    ],
    L_2_3: [
        [ 'x', ' ' ],
        [ 'x', ' ' ],
        [ 'x', 'x' ]
    ],
    L_2_2: [
        [ 'x', ' ' ],
        [ 'x', 'x' ]
    ]
};

const STYLES = {
    BOARD: {
        backgroundImage: 'url(/wood2.png)'
   }
};

const COLORS_COUNT = 4;
const SHAPE_TYPES = Object.keys(SHAPES);

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 15;

const DROP_EVERY_MS = 100;
const TICK_EVERY_MS = 500;
const BLANK_SPACE = ' ';

const EMPTY_ROW = () => {
    const row = [];
    for (let j = 0; j < BOARD_WIDTH; j++) {
        row[j] = BLANK_SPACE;
    }
    return row;
}

const EMPTY_BOARD = () => {
    const board = [];
    for (let i = 0; i < BOARD_HEIGHT; i++) {
        board.push(EMPTY_ROW());
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
            dropping: false,
            score: 0,
            board: EMPTY_BOARD(),
            currentBlock: NO_BLOCK,
            showAlert: false
        };

        // Additional fields, not part of component's React state. Updating
        // them does not make the component re-render.
        this.gameId = null;
        this.intervalId = null;
        this.keyboardEnabled = false;
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.started && this.state.started) {
            this.started();
        }
    }

    componentWillUnmount() {
        this.intervalId && clearInterval(this.intervalId);
        this.disableKeyboard();
    }

    // Color of a new shape
    randomColor() {
        return 1 + getRandomInt(COLORS_COUNT);
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
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== ' ') {
                    board[y + i][x + j] = color;
                }
            }
        }
    }

    // Render the block or clear it.
    // Determining if block can be placed
    canRenderAt(board, block, x, y) {
        const rows = SHAPES[block.shape];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== ' ') {
                    if (board[y + i][x + j] !== BLANK_SPACE) {
                        return false;
                    }
                }
            }
        }
        return true;
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
        const { x, y } = currentBlock;
        const canPlace = this.canRenderAt(board, currentBlock, x, y);
        if (canPlace) {
            this.renderBlock(board, currentBlock, currentBlock.color);
            // update state
            this.setState({ board, currentBlock });
        }
        return canPlace;
    }

    // when start is clicked, want to add the game 
    // to the firebase database
    // update state so that started is now true
    // had to separate because wasn't emptying board if start
    // was pressed during the game 
    start = () => {
        this.gameId = ApiGames.create();
        this.setState({ started: true, score: 0, board: EMPTY_BOARD() });
    }

    // what happens right after pressing start
    started = () => {
        // generate and render the next random block to show up at the top of the board
        this.nextBlock();
        this.intervalId = setInterval(this.tick, TICK_EVERY_MS);
        this.enableKeyboard();
    }

    pause = () => {
        this.intervalId && clearInterval(this.intervalId);
        this.intervalId = null;
        this.setState({ paused: true });
        this.disableKeyboard();
    }

    resume = () => {
        this.setState({ paused: false });
        if (this.state.dropping) {
            this.intervalId = setInterval(this.drop, DROP_EVERY_MS);
        } else {
            this.intervalId = setInterval(this.tick, TICK_EVERY_MS);
        }
        this.enableKeyboard();
    }

    // Move the block by desired [deltaX, deltaY], but check whether the target
    // space is not occupied by other blocks.
    moveBlock(deltaX, deltaY) {
        const { board, currentBlock } = this.state;
        let moved = true;

        // clear myself in order to check for the new position availability
        this.renderBlock(board, currentBlock, BLANK_SPACE);
        const x = currentBlock.x + deltaX;
        const y = currentBlock.y + deltaY;
        if (this.canRenderAt(board, currentBlock, x, y)) {
            currentBlock.x = x;
            currentBlock.y = y;
            this.renderBlock(board, currentBlock, currentBlock.color);
            this.setState({ board, currentBlock });
        } else {
            // move was not legal, put ourselves back on the board
            this.renderBlock(board, currentBlock, currentBlock.color);
            moved = false;
        }
        return moved;
    }

    moveBlockDown() {
        const { currentBlock } = this.state;
        const shapeType = currentBlock.shape;
        const shape = SHAPES[shapeType];
        const shapeHeight = shape.length;
        const boundsCheck = (currentBlock.y + shapeHeight < BOARD_HEIGHT);
        return boundsCheck && this.moveBlock(0, +1);
    }

    dropBlock = () => {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.drop, DROP_EVERY_MS);
        this.setState({ dropping: true });
    }

    moveBlockLeft = () => {
        const { currentBlock } = this.state;
        const boundsCheck = (currentBlock.x > 0);
        return boundsCheck && this.moveBlock(-1, 0);
    }

    moveBlockRight = () => {
        const { currentBlock } = this.state;
        const shapeType = currentBlock.shape;
        const shape = SHAPES[shapeType];
        const shapeWidth = shape[0].length;
        const boundsCheck = (currentBlock.x + shapeWidth < BOARD_WIDTH);
        return boundsCheck && this.moveBlock(+1, 0);
    }

    onKeyDown = (e) => {
        if (e.code === 'ArrowLeft' || e.key === 'ArrowLeft') {
            this.moveBlockLeft();
        }
        if (e.code === 'ArrowRight' || e.key === 'ArrowRight') {
            this.moveBlockRight();
        }
        if (e.code === 'ArrowDown' || e.key === 'ArrowDown') {
            this.dropBlock();
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

    gameOver() {
        clearInterval(this.intervalId)
        this.intervalId = null;
        this.disableKeyboard();
        this.setState({ started: false });
        ApiGames.finish(this.gameId);
        delete this.gameId;
        this.setState({ showAlert: true });
    }

    onAlertClose = () => {
        this.setState({ showAlert: false });
    }

    clearRow(board, rowIdx) {
        for (let i = 0; i < board[rowIdx].length; i++) {
            board[rowIdx][i] = BLANK_SPACE;
        }
    }

    isRowFull(board, rowIdx) {
        for (let i = 0; i < board[rowIdx].length; i++) {
            if (board[rowIdx][i] === BLANK_SPACE) {
                return false;
            }
        }
        return true;
    }

    // Move the rows down by shifting the array rows. Insert a blank row
    // into the 1st position.
    moveRowsDown(board, targetRowIdx) {
        for (let row = targetRowIdx; row > 0; row--) {
            board[row] = board[row - 1];
        }
        board[0] = EMPTY_ROW();
    }

    // We just placed a block. Check if any rows can be cleared:
    // - start from the bottom row
    // - if the row is not full, move up to the next row
    // - if the row is full:
    //   - if it's the 1st row, clear it
    //   - otherwise move all rows above it down by 1 field and keep checking
    //     from the same row idx
    clearRows() {
        const { board, currentBlock } = this.state;
        const shapeType = currentBlock.shape;
        const shape = SHAPES[shapeType];
        const shapeHeight = shape.length;
        let { score } = this.state;

        let shouldClear = false;
        for (let i = 0; i < shapeHeight; i++) {
            const rowIdx = currentBlock.y + i;
            if (this.isRowFull(board, rowIdx)) {
                shouldClear = true;
                score++;
            }
        }
        if (shouldClear) {
            let rowIdx = currentBlock.y + shapeHeight - 1;
            while (rowIdx >= 0) {
                if (!this.isRowFull(board, rowIdx)) {
                    rowIdx--;
                } else {
                    if (rowIdx === 0) {
                        this.clearRow(board, rowIdx);
                        rowIdx--;
                    } else {
                        this.moveRowsDown(board, rowIdx);
                    }
                }
            }
            this.setState({ board, score });
            ApiGames.updateScore(this.gameId, score);
        }
    }

    drop = () => {
        if (!this.moveBlockDown()) {
            this.clearRows();
            clearInterval(this.intervalId);
            this.setState({ dropping: false });
            if (this.nextBlock()) {
                this.intervalId = setInterval(this.tick, TICK_EVERY_MS);
            } else {
                this.gameOver();
            }
        }
    }

    // function to be called in setinterval
    tick = () => {
        if (!this.moveBlockDown()) {
            // check if any rows can be cleared
            this.clearRows();
            if (!this.nextBlock()) {
                this.gameOver();
            }
        }
    }

    cellClassName = (color) => {
        return color === BLANK_SPACE ? '' :`c c${color}`;
    }

    render() {
        const { board, started, paused, score, showAlert } = this.state;
        const can = {
            start: !started,
            pause: started && !paused,
            play: started && !paused,
            resume: paused
        };

        return (
            <div className='game'>
                {showAlert && <Alert message='Game Over' onClose={this.onAlertClose} />}
                <div className='score'>Score: {score}</div>
                <table className='board' style={STYLES.BOARD}>
                  <tbody>
                    {board.map((row, j) => (
                        <tr key={j}>{row.map((color, i) => (
                            <td key={i} className={this.cellClassName(color)}></td>
                        ))}</tr>
                    ))}
                  </tbody>
                </table>
                <div className='controls'>
                    <button className='button' onClick={this.moveBlockLeft} disabled={!can.play}>
                        ⇦
                    </button>
                    <button className='button' onClick={this.dropBlock} disabled={!can.play}>
                        ⇩
                    </button>
                    <button className='button' onClick={this.moveBlockRight} disabled={!can.play}>
                        ⇨
                    </button>
                    {can.start && 
                    <button className='button btn-start' onClick={this.start} disabled={!can.start}>
                        Start
                    </button>}
                    {can.pause &&
                    <button className='button btn-pause' onClick={this.pause} disabled={!can.pause}>
                        Pause
                    </button>}
                    {can.resume &&
                    <button className='button btn-resume' onClick={this.resume} disabled={!can.resume}>
                        Resume
                    </button>}
                </div>
            </div>
        );
    }
}

export default Game;
