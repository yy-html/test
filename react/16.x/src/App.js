import React, { Component, Fragment, createContext, useState } from 'react'

const { log, dir } = console

class App extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    log('mounted')
  }

  render() {
    return (
      <div>
        <A />
      </div>
    )
  }
}

function A() {
  const [t, setT] = useState(1)
  const [t2, setT2, f] = useState({a: 1})

  log('render', t2 === f.memoizedState.next.baseState)

  return <div onClick={() => {
    setT2({a: 2})
  }}>

  </div>
}

export default App