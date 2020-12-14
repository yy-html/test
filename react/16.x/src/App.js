import React, { Component, Fragment, createContext, useState, useEffect } from 'react'

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

  // log('render', t2 === f.memoizedState.next.baseState)

  return <div onClick={() => {
    setT(t + 1)
  }}>
    {t}
  </div>
}

export default App