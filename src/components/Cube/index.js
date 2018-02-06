import React from 'react'

import './index.css'

const Cube = (props) => {
  return (
    <div className={`cube${ props.exploded ? ' cube--exploded' : '' }${ props.orientation ? ' cube--orientation-' + props.orientation : '' }${ props.chosen ? ' cube--unfolded' : ''}`}>
      <div className="cube__face cube__face--front" style={{backgroundColor: props.colors[0]}}>
        <div className="cube__face cube__face--top" style={{backgroundColor: props.colors[1]}}/>
        <div className="cube__face cube__face--left" style={{backgroundColor: props.colors[2]}}/>
        <div className="cube__face cube__face--right" style={{backgroundColor: props.colors[3]}}/>
        <div className="cube__face cube__face--bottom" style={{backgroundColor: props.colors[4]}}>
          <div className="cube__face cube__face--back" style={{backgroundColor: props.colors[5]}}/>
        </div>
      </div>
    </div>
  )
}

export default Cube
