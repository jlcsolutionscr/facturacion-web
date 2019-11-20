import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import uiReducer from './ui/reducer'
import sessionReducer from './session/reducer'

export default combineReducers({
  ui: uiReducer,
  session: sessionReducer,
  routing
})
