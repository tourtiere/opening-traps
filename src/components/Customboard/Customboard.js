import React, { Component } from 'react';
import {connect} from 'react-redux';
import Chessboard from "lib/Chessboard";
import Chess from 'chess.js';
import {increment} from 'redux/modules/counter';
import {updateGame, animateTrap, animateForward, animateBackward, stopAnimation, startAnimation, erase} from 'redux/modules/chess';
import './style.css';
import store from 'redux/create';

setInterval(()=> {
  store.dispatch(animateTrap())
}, 1000);

const dropSquareColor = 'rgb(255, 255, 255)';

class Customboard extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      allowDrop: false,
      dropSquareStyle: {},
      sourceSquare: ''
    }
  }

  onDrop({sourceSquare, targetSquare}){
    let game = this.props.game;
    let move = game.move({ from: sourceSquare, to: targetSquare });
    if (move === null) return;
    this.props.updateGame(game);
  }

  undo(){
    let game = this.props.game;
    let undo = game.undo();
    this.props.updateGame(game);
  }

  onDragOverSquare(targetSquare){
    let allowDrop = true;
    let coords = { from: this.state.sourceSquare, to: targetSquare}
    let move = this.props.game.move(coords);
    let dropSquareStyle = {}
    if (move !== null){
        dropSquareStyle = { boxShadow: `inset 0 0 1px 4px ${dropSquareColor}` }
        this.props.game.undo()
    }
    this.setState({dropSquareStyle});
  }

  onMouseOverSquare(sourceSquare){
    if (this.state.sourceSquare !== sourceSquare){
      this.setState({sourceSquare})
    }
  }
  
  computeCpStyle(){
    let cp = this.props.stockfish.cp;
    let width = null;
    
    if (cp === null){
      let mate = this.props.stockfish.mate;
      cp = (mate / Math.abs(mate)) * 50 * 100;
      width = Math.max(280 - cp/100 * 20, 0)
    }else{
      width = Math.max(280 - cp/100 * 20, 0)
    }
    return {
      width: `${width}px`
    }
  }

  render() {

    return (
      <div className='chessboard-wrapper'>
      <div className='custom-chessboard'>
        <div className='opening-title'>{this.props.trap === null ? '': this.props.trap.title }</div>
        
        <div className="cp-tracker-wrapper" style={{visibility: this.props.trap ? '' : 'hidden'}}>
          <div className="cp-tracker-ball">
            {this.props.stockfish.mate == null ? Number((this.props.cp/100).toFixed(1)) : 'mate' + this.props.stockfish.mate}
          </div>

          <div className="cp-tracker" style={this.computeCpStyle()}>
          </div>
        </div>

        <Chessboard
          undo={true}
          boardStyle={{margin:'auto'}}
          position={this.props.game.fen()}
          transitionDuration={100}
          onDrop={this.onDrop.bind(this)}
          onDragOverSquare={this.onDragOverSquare.bind(this)}
          dropSquareStyle={this.state.dropSquareStyle}
          onMouseOverSquare={this.onMouseOverSquare.bind(this)}
          draggable={!this.props.trap}/>
        
        <div className="chessboard-controller">

          <button className="btn btn-light eraser" disabled={this.props.isAnimating} onClick={this.props.erase}>
            <span className="fa fa-eraser" aria-hidden="true"></span>
          </button>

          <div className='centered-btn-wrapper'>
            <button className="btn btn-light centered-btn" disabled={this.props.isAnimating || !this.props.trap} onClick={this.props.animateBackward}>
              <span className="fa fa-step-backward" aria-hidden="true"></span>
            </button>
              
            <button className="btn btn-light centered-btn" disabled={!this.props.trap} onClick={this.props.isAnimating ? this.props.stopAnimation : this.props.startAnimation}>
              <span className={'fa ' + (this.props.isAnimating ? 'fa-pause' :'fa-play')} aria-hidden="true"></span>
            </button>
            

            <button className="btn btn-light centered-btn" disabled={this.props.isAnimating || !this.props.trap} onClick={this.props.animateForward}>
              <span className="fa fa-step-forward" aria-hidden="true"></span>
            </button>
          </div>
        </div>
        
      </div>
      </div>
    );
  }
}

// start of code change
const mapStateToProps = (state) => {
  return {
    opening: state.chess.opening,
    fen: state.chess.fen,
    game: state.chess.game,
    cp: state.chess.cp,
    isAnimating: state.chess.isAnimating,
    trap: state.chess.trap,
    stockfish: state.chess.stockfish
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateGame: (game) => { dispatch(updateGame(game)) },
    animateForward: () => { dispatch(animateForward()) },
    stopAnimation: () => { dispatch(stopAnimation()) },
    startAnimation: () => { dispatch(startAnimation()) },
    animateBackward: () => { dispatch(animateBackward()) },
    erase: () => { dispatch(erase()) },

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Customboard);