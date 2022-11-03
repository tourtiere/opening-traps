import { createStore } from 'redux';
import reducer from './modules/reducer';

let store = createStore(reducer);
export default store;