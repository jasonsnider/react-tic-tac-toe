import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  let victoryClass = (props.victoryLine===true)?'victory-line':'';
  return (
    <button className={"square " + victoryClass} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i, victoryLine) {
    return <Square 
      value={this.props.squares[i]} 
      onClick={()=>this.props.onClick(i)}  
      victoryLine={victoryLine}
    />;
  }

  render() {
    let line = [];
    let draw = false;
    const winner = calculateWinner(this.props.squares);

    if(winner){
      line = winner.line;
      draw = winner.result==='draw'?true:false;
    }
    

    let square = 0;
    let board =[];
    for(let rows = 0; rows<=2; rows++){
      let row=[];
      for(let cols = 0; cols<=2; cols++){
        
        let highlight = false;
        if(!draw){
          if(line.includes(square)){
            highlight = true;
          }
        }

        row.push(this.renderSquare(square++, highlight));
        
      }
      board.push(<div className="board-row">{row}</div>);
    }

    return (
      <div>{board}</div>
    );
  }
}
  
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state={
      history:[{
        squares: Array(9).fill(null),
      }],
      stepNumber:0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    //Do not allow clicking if the game is over or if a square is has already
    //been clicked
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext?'X':'O';
    this.setState({
      history: history.concat([{
        squares :squares,
        position : i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  getPosition(position){
    let pos = {};
    pos.col = (position % 3) +1;
    pos.row = (position<=2)?1:(position<=5)?2:3;

    return pos;
  }
  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2)===0,
    });
  }
  flipSortOrder(){

    if(!this.state.flipSortOrder){
      this.setState({
        flipSortOrder: true
      });
    }else{
      this.setState({
        flipSortOrder: false
      });
    }

  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move)=>{
      let pos = this.getPosition(step.position);



      const desc = move ?
        `Go to move #${move}: square ${step.position}, row ${pos.row} column ${pos.col}` :
        'Go to game start';
      return (
        <li key={move}>
          <button 
            className={(move === this.state.stepNumber)? 'btn-active' : '' }
            onClick={()=>this.jumpTo(move)}
          >{desc}</button>
        </li>
      );
    });


    let status;
    if(winner){
      status = 'Winner: ' + winner.result;
    }else{
      status = 'Next player: ' + (this.state.isIsNext ? 'X' : 'O');
    }

    if (this.state.flipSortOrder) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={()=>{this.flipSortOrder()}}>Flip</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

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
      return {'result':squares[a], 'square':squares[a], 'line':lines[i]};
    }
  }

  let isDraw=true;
  for(let i=0; i<squares.length; i++){
    if(squares[i]==null){
      isDraw=false;
    }
  }

  if(isDraw){
    return {'result':'draw'};
  }
  

  return null;
}


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
