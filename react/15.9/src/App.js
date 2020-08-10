import React, { Component } from 'react'

const { log, dir } = console

class App extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    log('mounted')
  }

  render() {
    return (
      <div>
        
      </div>
    )
  }
} 

export default App