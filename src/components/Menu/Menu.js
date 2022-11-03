import React, { Component } from 'react';
import {connect} from 'react-redux';
import {selectOpening, selectTrap} from 'redux/modules/chess';

import './style.css'

class Menu extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      openings: [{title: 'test'}, {title: 'test4'}, {title: 'asdfsafd'}]
    }
  }

  renderOpenings(){
    return this.props.openings.map((opening, x) =>{
      let activeClassName = '';
      return (<li
        className={`list-group-item list-group-item-action ${activeClassName}`}
        key={x}
        onClick={()=>{this.props.selectOpening(opening)}}>{opening.title} ({opening.subtitle})</li>)
    })
  }

  menuBack(){
    this.props.selectOpening(null)
  }

  clickTrap(trap){
    this.props.selectTrap(trap);
    
  }

  renderOrdered(items){
    let selectedTrap =this.props.trap; 
    return this.props.opening.traps.map((trap, x) => {
      let activeClass = (trap === selectedTrap) ? 'active' : ''
      return (<li
        className={`list-group-item list-group-item-action ${activeClass}`}
        key={x}
        onClick={()=>{this.clickTrap(trap)}}>{trap.title}</li>)
    })
  }
  
  renderTraps(){
    let selectedTrap =this.props.trap;
    let whiteTraps = this.props.opening.traps.filter(trap => trap.white_win)
    let blackTraps = this.props.opening.traps.filter(trap => !trap.white_win)

    const renderColoredTraps = (trap, x) => {
      let activeClass = (trap === selectedTrap) ? 'active' : ''
      return (<li
        className={`list-group-item list-group-item-action ${activeClass}`}
        key={x}
        onClick={()=>{this.clickTrap(trap)}}>{trap.title}</li>)
    }

    const whiteRendering = whiteTraps.map(renderColoredTraps)
    const blackRendering = blackTraps.map(renderColoredTraps)

    return (
      <div>
        {whiteRendering}
        {blackRendering}
      </div>)
  }

  renderOpenings(){
    let selectedOpening =this.props.opening; 
    return this.props.openings.map((opening, x) =>{
      let activeClass = (opening === selectedOpening) ? 'active' : ''
      return (<li
        className={`list-group-item list-group-item-action ${activeClass}`}
        key={x}
        onClick={()=>{this.props.selectOpening(opening)}}>{opening.title} ({opening.subtitle})</li>)
    })
  }

  render() {
    return (
      <div className='menu-wrapper'>
        <div className="header">
          <img src={'/images/title.png'}/>
        </div>
        
        <div className='subtitle-wrapper'>
            {this.props.opening !== null ? (<span className="fa fa-chevron-left back" aria-hidden="true" onClick={this.menuBack.bind(this)}></span>) : null}
            <span className='subtitle-text'>
            {this.props.opening !== null ? `${this.props.opening.title} ${this.props.opening.subtitle}` : 'Select an opening'}
            </span>

        </div>

        <div className='list-group-wrapper'>
          <ul className="list-group list-group-flush">
            {this.props.opening !== null ? this.renderTraps() : this.renderOpenings()}
          </ul>
        </div>


      </div>
    );
  }
}

// start of code change
const mapStateToProps = (state) => {
  return {
    openings: state.chess.openings,
    opening: state.chess.opening,
    trap: state.chess.trap
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectOpening: (opening) => {dispatch(selectOpening(opening))},
    selectTrap: (trap) => {dispatch(selectTrap(trap))}
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Menu);