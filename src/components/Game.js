import React, { Component } from "react";
import Board from "./Board";
import "./style.css";

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.renderMoves = this.renderMoves.bind(this);
    this.jumpTo = this.jumpTo.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      xIsNext: true,
      winner: null,
      draw: false,
      winIndexes: [],
      stepNumber: 0,
      history: [
        {
          squares: Array(9).fill(null)
        }
      ]
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.state.winner || squares[i]) return;
    const xIsNext = this.state.xIsNext;
    squares[i] = xIsNext ? "X" : "O";
    const winner = calculateWinner(squares);
    const winIndexes = winner.indexes;
    const draw = isAllSquareOccupied(squares) && !winner.winner;

    this.setState({
      history: history.concat({ squares }),
      xIsNext: !xIsNext,
      winner: winner.winner,
      stepNumber: history.length,
      winIndexes,
      draw
    });
  }

  jumpTo(step) {
    const history = this.state.history[step];
    const winner = calculateWinner(history.squares);
    const winIndexes = winner.indexes;
    const draw = isAllSquareOccupied(history.squares) && !winner.winner;

    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      winner: winner.winner,
      winIndexes,
      draw
    });
  }

  playAgain() {
    this.setState(this.getInitialState());
  }

  renderActions() {
    return (
      <div className="game-actions">
        <button onClick={this.playAgain}>PLAY AGAIN</button>
      </div>
    );
  }

  renderMoves() {
    return this.state.history.map((step, move) => {
      const desc = move ? "Go to move " + move : "Go to game start!";
      return (
        <li
          key={move}
          onClick={() => this.jumpTo(move)}
          className={move === this.state.stepNumber && "green"}
        >
          <span>{desc}</span>{" "}
        </li>
      );
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares;

    let status;

    if (this.state.winner) {
      status = "The winner is player " + this.state.winner;
    } else if (this.state.draw) {
      status = "Draw! No Winners for this round";
    } else {
      status = "The next player is " + (this.state.xIsNext ? "X" : "O");
    }

    let actionsUI;
    if (this.state.winner || this.state.draw) {
      actionsUI = this.renderActions();
    }

    return (
      <div className="game">
        <div className="game-container">
          <header>
            <h1>Tic Tac Toe</h1>
          </header>
          <div className="game-board">
            <div className="board-status">{status}</div>
            <Board
              squares={squares}
              onClick={i => this.handleClick(i)}
              winIndexes={this.state.winIndexes}
            />
            {actionsUI}
          </div>
        </div>
        <div className="game-status">
          <h1 className="title">Game History</h1>
          <ul className="game-moves">{this.renderMoves()}</ul>
        </div>
      </div>
    );
  }
}

function isAllSquareOccupied(squares) {
  return squares.filter(s => s).length === 9;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], indexes: lines[i] };
    }
  }
  return { winner: null, indexes: [] };
}
