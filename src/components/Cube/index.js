import React from 'react'

import './index.css'

const Cube = (props) => {
  return (
    <div className={`cube${ props.exploded ? ' cube--exploded' : '' }${ props.orientation ? ' cube--orientation-' + props.orientation : '' }`}>
      <div className="cube__face cube__face--1" style={{backgroundColor: props.colors[0]}}/>
      <div className="cube__face cube__face--2" style={{backgroundColor: props.colors[1]}}/>
      <div className="cube__face cube__face--3" style={{backgroundColor: props.colors[2]}}/>
      <div className="cube__face cube__face--4" style={{backgroundColor: props.colors[3]}}/>
      <div className="cube__face cube__face--5" style={{backgroundColor: props.colors[4]}}/>
      <div className="cube__face cube__face--6" style={{backgroundColor: props.colors[5]}}/>
    </div>
  )
}

export default Cube
