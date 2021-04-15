import React from 'react';

const SHAPES = {
    SQUARE_2_2: 1,
    BAR_2_1: 2
};

const BOARD_WIDTH = 30;
const BOARD_HEIGHT = 20;

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

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            started: false,
            paused: false,
            board: EMPTY_BOARD(),
            currentBlock: null
            // { color: 1, shape: SHAPES.SQUARE_2_2 }
        };

    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    nextBlock() {
        const { board } = this.state;
        // SQUARE_2_2
        board[0][0] = '1';
        board[0][1] = '1';
        board[1][0] = '1';
        board[1][1] = '1';
        this.setState({ board });
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
