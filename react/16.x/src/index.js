import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'

const { log, dir } = console

ReactDOM.render(
  <Router>
    <App></App>
  </Router>,
  document.querySelector('#root')
)