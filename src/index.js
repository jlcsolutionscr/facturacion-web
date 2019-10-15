import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Home from './components/home'
import * as serviceWorker from './serviceWorker'
import './fonts/RussoOne-Regular.ttf'

ReactDOM.render(<Home />, document.getElementById('root'))

serviceWorker.unregister()
