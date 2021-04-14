import React from 'react';

const SHAPES = {
    SQUARE_2_2: 1,
    BAR_2_1: 2
};

const TICK_EVERY_MS = 1500;

class Game extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            started: false,
            paused: false,
            board: [
                ['1', '1', ' '],
                ['1', '1', ' '],
                [' ', '1', ' '],
                ['2', '3', '3']
            ],
            currentBlock: null
            // { color: 1, shape: SHAPES.SQUARE_2_2 }
        };

    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    start = () => {
        this.setState({ started: true });
        this.intervalId = setInterval(this.tick, TICK_EVERY_MS);
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
        const { started, paused } = this.state;
        return (
            <div>
                <button onClick={this.start} disabled={started}>Start</button>
                <button onClick={this.pause} disabled={!started || paused}>Pause</button>
                <button onClick={this.resume} disabled={!started || !paused}>Resume</button>
            </div>
        );
    }
}

export default Game;
