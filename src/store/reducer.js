import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import uiReducer from './ui/reducer'

export default combineReducers({
  ui: uiReducer,
  routing
})
