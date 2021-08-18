import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import appReducer from 'store/reducer'
import { INITIAL_STATE } from 'store/InitialState'

import RoutingPage from 'pages/routing-page'

const store = createStore(appReducer, INITIAL_STATE, applyMiddleware(thunk))

const App = () => {
  return (
    <Provider store={store}>
      <RoutingPage />
    </Provider>
  )
}

export default App