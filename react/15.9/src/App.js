import React, { Component, Fragment } from 'react'

const { log, dir } = console

class App extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    log('mounted')
    // log(1, <Fragment />)
  }

  render() {
    return (
      <div>
        
      </div>
    )
  }
} 

export default App