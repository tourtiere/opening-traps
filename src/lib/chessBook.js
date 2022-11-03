//types
import {selectTrap} from 'redux/modules/chess'
const openings = require("./chessData.js");
const {Chess} = require("chess.js");


function checkOpeningConditions(history, conditions){

  for (var i = 0; i < conditions.length; i++) {
    let {exclude_last, moves} = conditions[i];
    if (moves.length > history.length) continue;

    for (var j = 0; j < moves.length; j++) {

      if (j == moves.length - 1){
        if (moves[j] === history[j] && !exclude_last){
          return true;
        }else if (moves[j] !== history[j] && exclude_last){
          return true
        }
      }else{
        if (moves[j] !== history[j]) break;
      }

    }
  }

  return false;
}

function computeOpening(game){
  let history = game.history();
  let maxMoves = 0;
  let finalOpening = null;
  
  for (var i = 0; i < openings.length; i++) {
    let opening = openings[i];
    let isOpening = checkOpeningConditions(history, opening.conditions);
    let openingLength = opening.conditions[0].moves.length;
    if (isOpening && openingLength > maxMoves){
      finalOpening = opening;
      maxMoves = openingLength
    }
  }

  return finalOpening;
}


 export {openings, computeOpening}; 
