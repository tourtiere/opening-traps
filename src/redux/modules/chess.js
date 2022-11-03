//types
import {computeOpening, openings} from 'lib/chessBook';
import Chess from 'chess.js'

const SELECT_OPENING = 'chess/SELECT_OPENING';
const SELECT_TRAP = 'chess/SELECT_TRAP';
const STOP_ANIMATION = 'chess/STOP_TRAP_ANIMATION';
const START_ANIMATION = 'chess/START_TRAP_ANIMATION';

const AUTO_ANIMATE_TRAP = 'chess/AUTO_ANIMATE_TRAP';
const ANIMATE_TRAP_FORWARD = 'chess/ANIMATE_TRAP_FORWARD';
const ANIMATE_TRAP_BACKWARD = 'chess/ANIMATE_TRAP_BACKWARD';

const UPDATE_GAME = 'chess/UPDATE_GAME';
const UPDATE_FEN = 'chess/UPDATE_FEN';

const BOARD_TO_OPENING = 'chess/BOARD_TO_OPENING';

const ERASE = 'chess/ERASE';

const initialState = {
  trap: null,
  moves: [],
  move_id: 0,
  isAnimating: false,
  openings: openings,
  opening: null,
  fen: 'start',
  game: new Chess(),
  cp:0,
  stockfish: {mate:null, cp:null}
}

//DO EVERYTHING HERE
function movesToFen(moves){
  let game = new Chess();
  for (var i = 0; i < moves.length; i++) {
    game.move(moves[i])
  }
  return game.fen()
}

function playSound(game){
  let moves = game.history()
  let lastMove = game.undo()
  let isCaptured = lastMove.captured !== undefined  
  game.move(lastMove)
  let url = isCaptured ?'/sounds/capture.mp3' : '/sounds/move-self.mp3'
  let audio = new Audio(url);
  audio.play()
}
function animate(state, forward=true){
  let moves = state.trap.moves
  let move_id = state.move_id
  
  if ((move_id ==0 && !forward) || (move_id == moves.length && forward)){
    return {...state, isAnimating: false}
  }

  let game = state.game;
  let cp = null
  let stockfish = state.trap.stockfish[move_id]
  if (forward){
    cp = state.trap.stockfish[move_id].cp
  }else{
    cp = state.trap.stockfish[move_id - 1].cp
   
  }

  if (forward){
    let move = state.trap.moves[move_id]
    game.move(move, {sloppy: true})
    playSound(game)

    move_id +=1
  }else{
    playSound(game)  
    game.undo()

    move_id -=1
    stockfish = state.trap.stockfish[move_id]
  }

  let fen = game.fen()
  return {...state, game, fen, move_id, cp, stockfish}
}

export default function reducer(state = initialState, action = {}) {
  
  switch (action.type) {
    
    case SELECT_OPENING:
      return { ...state,
        opening: action.opening
      }

    case SELECT_TRAP:
      return { ...state,
        trap: action.trap,
        fen: 'start',
        move_id: 0,
        cp: 0,
        stockfish: {mate:null, cp:null},
        isAnimating: true,
        game: new Chess()
      }

    case UPDATE_GAME:
      playSound(action.game)
      let opening = computeOpening(action.game)
      return { ...state,
        opening: computeOpening(action.game),
        fen: action.game.fen(),
        game: action.game
      }

    //animation
    case ANIMATE_TRAP_FORWARD:
      if (state.isAnimating) return state;
        return animate(state, true)

    case ANIMATE_TRAP_BACKWARD:
      if (state.isAnimating) return state;
        return animate(state, false)

    case AUTO_ANIMATE_TRAP:
      if (!state.isAnimating) return state;
      return animate(state, true)

    case STOP_ANIMATION:
      return {...state, isAnimating: false}

    case START_ANIMATION:
      return {...state, isAnimating: true}

    case ERASE:
      return {...state, opening:null, trap: null, game: new Chess(), cp:0}

    default:
      return state;

  }
}

/*
  two ways to trigger opening state
  - newBoard (game): lib(gameToOpening) opening_object, player_mode=false
  - selectopening (opening_id) -> opening_object, player_mode=false

  trigger trap
  - selectTrap(trap_id) -> trap_object, player_mode=true

*/

//select
export function selectOpening(opening) {
  return {
    type: SELECT_OPENING,
    opening: opening
  }
}

export function selectTrap(trap) {
  return {
    type: SELECT_TRAP,
    trap: trap
  }
}

//update
export function updateGame(game) {
  return {
    type: UPDATE_GAME,
    game: game
  }
}

//animation
export function stopAnimation() {
  return {
    type: STOP_ANIMATION
  }
}

export function startAnimation() {
  return {
    type: START_ANIMATION
  }
}

export function animateTrap() {
  return {
    type: AUTO_ANIMATE_TRAP,
  }
}

export function animateForward() {
  return {
    type: ANIMATE_TRAP_FORWARD,
  }
}

export function animateBackward() {
  return {
    type: ANIMATE_TRAP_BACKWARD,
  }
}

export function erase() {
  return {
    type: ERASE,
  }
}