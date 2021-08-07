import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import './fonts/RussoOne-Regular.ttf'

import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

serviceWorker.unregister()
