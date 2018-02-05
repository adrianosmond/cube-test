import React, { Component } from 'react';

import Cube from './components/Cube'

import './App.css';

const colors = ['red', 'blue', 'green', 'gold', 'deepskyblue', 'magenta']

const shuffle = (array) => {
  let ret = [...array]
  for (let i=ret.length - 1; i > 0; i--) {
    let j=Math.floor(Math.random() * (i+1))
    let temp = ret[i]
    ret[i] = ret[j]
    ret[j] = temp
  }
  return ret
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = this.generatePuzzle()
  }

  generatePuzzle() {
    const solution = shuffle(colors)
    const decoy1 = shuffle(colors)
    const decoy2 = shuffle(colors)
    const decoy3 = shuffle(colors)
    const decoy4 = shuffle(colors)
    const options = shuffle([solution, decoy1, decoy2, decoy3, decoy4])
    return {
      solution,
      orientation: Math.round(Math.random() * 24),
      options
    }
  }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        <div className="solution">
          <Cube colors={this.state.solution} orientation={this.state.orientation} />
        </div>
        <ul className="options">
          {this.state.options.map((cube, idx)=>{
            return (
              <li className="options__choice" key={idx}>
                <Cube colors={cube} exploded={true} />
                {/* {cube === this.state.solution ? <p>XXX</p> : null} */}
              </li>
            )
          })}
        </ul>
      </div>
    );
  }
}

export default App;
