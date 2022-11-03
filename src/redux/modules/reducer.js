import { combineReducers } from 'redux';

import counter from './counter';
import chess from './chess';

let rootReducer = combineReducers({counter, chess});
export default rootReducer;