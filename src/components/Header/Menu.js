import React, { Component } from 'react';
import {connect} from 'react-redux';
import {increment} from 'redux/modules/counter';
import './style.css'
class Menu extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      openings: [{title: 'test'}, {title: 'test4'}, {title: 'asdfsafd'}]
    }
  }
  
  render() {
    return (
      <div className='menu-wrapper'>
        {
          this.state.openings.map((opening) =>{
            return (<p key={opening.title}>{opening.title}</p>)
          })
        }
      </div>
    );
  }
}

// start of code change
const mapStateToProps = (state) => {
  return { count: state.counter.count };
};

const mapDispatchToProps = dispatch => {
  return {
    onCounterClick: () => {dispatch(increment())}
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Menu);