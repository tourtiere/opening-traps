import React, { Component } from 'react';
import './style/bootstrap.min.css';
import './style/font-awesome/css/all.min.css';
import './App.css';

import {Provider} from 'react-redux';
import store from './redux/create';

import Customboard from './components/Customboard/Customboard'
import Menu from './components/Menu/Menu'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    }
  }
  
  render() {
    return (
      <Provider store={store} key="provider">
        <div className="App">
            <Menu/>
            <Customboard />
        </div>
      </Provider>
    );
  }
}

export default App;
