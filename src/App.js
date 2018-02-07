import React, { Component } from 'react'

import Cube from './components/Cube'

import './App.css'

const NUM_OPTIONS = 5
const GAME_DURATION = 60000
const CORRECT_BONUS = 15000
const HIGH_SCORE_KEY = 'highScore'
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

// This array defines which faces of the cube will
// be visible for each of the 24 possible orientations.
// The faces are as follows:
//
//       1
//   2   0   3
//       4
//       5
//
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
  return visibles.map(v => solution[v])
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

const rateColorMatch = (correctColors, incorrectColors) => {
  return incorrectColors.reduce((tot,current,idx) => {
  	if (correctColors[idx]===current)
      return tot + (25 * (idx===0 ? 2 : 1))
  	else if (correctColors.indexOf(current)>=0)
      return tot + 10
  	else
      return tot
  }, 0)
}

const bestIncorrectOrientation = (solution, orientation, incorrect) => {
  const solutionColors = getVisibleColors(solution, orientation)
  let bestRating = 0
  let bestRatingIdx = 0
  for (let i=1; i<=24; i++) {
    let incorrectColors = getVisibleColors(incorrect, i)
    let matchScore = rateColorMatch(solutionColors, incorrectColors)
    if (matchScore > bestRating) {
      bestRating = matchScore
      bestRatingIdx = i
    }
  }
  return bestRatingIdx
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.generatePuzzle(),
      active: false,
      ended: false,
      percentage: 100,
      highScore: parseInt(localStorage.getItem(HIGH_SCORE_KEY),10) || 0
    }
  }

  tick() {
    const percentage = Math.max(0, ((new Date().getTime() - this.state.startTime) / GAME_DURATION) * 100)
    this.setState({
      percentage
    })
    if (percentage < 100) requestAnimationFrame(this.tick.bind(this))
    else this.endGame()
  }

  startGame() {
    this.setState({
      active: true,
      score: 0,
      startTime: new Date().getTime()
    })
    requestAnimationFrame(this.tick.bind(this))
  }

  endGame() {
    if (this.state.score > this.state.highScore) {
      localStorage.setItem(HIGH_SCORE_KEY, this.state.score)
    }
    this.setState({
      active: false,
      ended: true,
      highScore: Math.max(this.state.score, this.state.highScore)
    })
  }

  generatePuzzle() {
    const solution = shuffle(colors)
    const orientation = Math.ceil(Math.random() * 24)
    let options = [solution]
    while (options.length < NUM_OPTIONS) {
      let decoy = shuffle(colors)
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
    const { solution, orientation, score, startTime } = this.state
    const correct = cube === solution

    this.setState({
      chosen: cube,
      wrongOrientation: correct ? null : bestIncorrectOrientation(solution, orientation, cube),
      score: score + (correct ? 1 : -1),
      startTime: startTime + (correct ? CORRECT_BONUS : 0)
    })

    setTimeout(() => {
      this.setState(this.generatePuzzle())
    }, 3000)
  }

  render() {
    return (
      <div className="game">
        <div className="game__timer">
          <div className="game__timer-bar" style={{
            transform: `translateX(-${this.state.percentage}%)`
          }}></div>
        </div>
        {this.state.active ?
          <div className="game__game">
            <div className="game__score">{this.state.score}</div>
            <div className="solution">
              <Cube colors={this.state.solution} orientation={this.state.orientation} />
            </div>
            <ul className={`options${this.state.chosen? '' : ' options--no-choice'}`}>
              {this.state.options.map((cube, idx)=> {
                let orientation = null
                let chosenClass = ''
                if (this.state.chosen) {
                  if (cube === this.state.solution) {
                    orientation = this.state.orientation
                    chosenClass = 'options__choice--correct'
                  } else if (this.state.chosen === cube) {
                    orientation = this.state.wrongOrientation
                    chosenClass = 'options__choice--incorrect'
                  }
                }
                return (
                  <li className={`options__choice ${chosenClass}`} key={idx} onClick={this.makeSelection.bind(this, cube)}>
                    <Cube colors={cube} exploded={orientation ? false : true} orientation={orientation} />
                  </li>
                )
              })}
            </ul>
          </div>
          : <div className="game__game game__game--not-active">
              {this.state.ended ?
                <div>
                  <p className="game__final-score">You scored {this.state.score}</p>
                  <p className="game__high-score">Your high score is {this.state.highScore}</p>
                  <button className="game__start-button game__start-button--restart" onClick={this.startGame.bind(this)}>Play again</button>
                </div>
              : <button className="game__start-button" onClick={this.startGame.bind(this)}>Start</button>}

            </div>}
      </div>
    )
  }
}

export default App
