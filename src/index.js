import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import $ from 'jquery';


function Square(props) {
  let buttonClass = "square";
  if (props.thisWinButton !== undefined) {
    let winnerCombination = props.thisWinButton;
    let currentElement = props.number + "";
    if (winnerCombination.includes(currentElement)) {
       buttonClass = "square winner"
    }
  }

  return (
      <button className={buttonClass} onClick={props.onClick}>
        {props.value}
      </button>
  )
}

class Board extends React.Component {

  renderSquare = (i) => {
      return (
          <Square
              key={i}
              number={i}
              thisWinButton = {this.props.thisWin}
              value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}
          />
      );
  };

  render() {
    var buildSquare = [];
    for (let i=0; i<9; i = i+3) {
      for (let j=0; j<3; j++ ) {
        buildSquare.push(this.renderSquare(i+j));
      }
    }
    return(
        <div>
          {buildSquare}
        </div>
    );

    // return (
    //     <div>
    //       <div className="board-row">
    //         {this.renderSquare(0)}
    //         {this.renderSquare(1)}
    //         {this.renderSquare(2)}
    //       </div>
    //       <div className="board-row">
    //         {this.renderSquare(3)}
    //         {this.renderSquare(4)}
    //         {this.renderSquare(5)}
    //       </div>
    //       <div className="board-row">
    //         {this.renderSquare(6)}
    //         {this.renderSquare(7)}
    //         {this.renderSquare(8)}
    //       </div>
    //     </div>
    // );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      coordinates:  Array(9).fill(null),
      i: 0,
      bold: 999,
      divisionNum: 0
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    let coordinates;
    switch (i) {
      case 0: coordinates = '1:1';break;
      case 1: coordinates = '1:2';break;
      case 2: coordinates = '1:3';break;
      case 3: coordinates = '2:1';break;
      case 4: coordinates = '2:2';break;
      case 5: coordinates = '2:3';break;
      case 6: coordinates = '3:1';break;
      case 7: coordinates = '3:2';break;
      case 8: coordinates = '3:3';break;
      default:break;
    }

    const coordsArr = this.state.coordinates;
    coordsArr[this.state.stepNumber +1] = coordinates;

    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length ,
      xIsNext: !this.state.xIsNext,
      coordinates: coordsArr,
      i: i,
      bold: 999
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === this.state.divisionNum,
      bold: step,
    });
  }

  changeStarter = () => {
    let history = this.state.history;
    let currentStateBox = history[this.state.stepNumber].squares;
    if (currentStateBox.every((val) => val === null)){
      this.setState({
        divisionNum: (this.state.divisionNum ===1) ? 0 : 1,
        xIsNext: !this.state.xIsNext,
      });
      //console.log('Nqma stoinosti');
    } else {
      alert('Not allowed, start new game');
    }
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const coords = this.state.coordinates;
    const moves = history.map((step, move) => {
      const currentCoordinates = coords[move];
      const desc = move ?
          'Go to move #' + move + ' Coordinates: ' + currentCoordinates:
          'Go to game start';
      if (move === this.state.bold) {
        return (
            <li key={move}>
              <button style={{fontWeight: 'bold'}} onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        );
      }else {
        return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        );
      }
    });
    let status;
    let madeSteps = this.state.stepNumber;
    if (winner) {
      status = 'Winner: ' + winner.split('|')[0];
      var winnerA =  winner.split('|')[1];
    } else {
      if (madeSteps !== 9){
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      } else {
        status = "Draw";
      }
    }
    return (
        <div className="game">
          <div className="game-board">
            <Board
                key = {1}
                thisWin={winnerA}
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
            <button onClick={this.changeStarter}>Change starter player</button>

          </div>
          <div className="game-info">
            <div className="status">{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
    );
  }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a] + '|'+a+b+c;
    }
  }
  return null;
}
