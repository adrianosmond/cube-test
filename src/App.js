import React, { Component } from 'react';

import Cube from './components/Cube'

import './App.css';


const NUM_OPTIONS = 5;
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

const orientationVisibles = [[],
  [5,4,3], [5,2,4], [5,3,1], [5,1,2],
  [0,2,1], [0,1,3], [0,4,2], [0,3,4],
  [2,0,4], [2,4,5], [2,1,0], [2,5,1],
  [3,1,5], [3,0,1], [3,5,4], [3,4,0],
  [4,0,3], [4,2,0], [4,3,5], [4,5,2],
  [1,2,5], [1,5,3], [1,0,2], [1,3,0]
]

const getVisibleColors = (solution, orientation) => {
  const visibles = orientationVisibles[orientation]
  return visibles.map(v => solution[v]);
}

const solutionsClash = (solution, orientation, potentialClash) => {
  const solutionColors = getVisibleColors(solution, orientation)
  for (let i=1; i<=24; i++) {
    let clashColors = getVisibleColors(potentialClash, i)
    if (solutionColors[0] === clashColors[0] &&
        solutionColors[1] === clashColors[1] &&
        solutionColors[2] === clashColors[2]) {
      return true
    }
  }
  return false
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = this.generatePuzzle()
  }

  generatePuzzle() {
    const solution = shuffle(colors)
    const orientation = Math.ceil(Math.random() * 24)
    let options = [solution]
    while (options.length < NUM_OPTIONS) {
      let decoy = shuffle(colors);
      if (!solutionsClash(solution, orientation, decoy)) {
        options.push(decoy)
      }
    }

    options = shuffle(options)
    return {
      solution,
      orientation,
      options,
      chosen: false
    }
  }

  makeSelection(cube) {
    this.setState({
      chosen: true
    })

    // setTimeout(() => {
    //   this.setState(this.generatePuzzle())
    // }, 3000)
  }

  render() {
    return (
      <div className="App">
        <div className="solution">
          <Cube colors={this.state.solution} orientation={this.state.orientation} chosen={this.state.chosen} />
        </div>
        <ul className="options">
          {this.state.options.map((cube, idx)=>{
            return (
              <li className={`options__choice${this.state.chosen && cube === this.state.solution ? ' options__choice--correct' : ''}`} key={idx} onClick={this.makeSelection.bind(this, cube)}>
                <Cube colors={cube} exploded={true} />
              </li>
            )
          })}
        </ul>
      </div>
    );
  }
}

export default App;
