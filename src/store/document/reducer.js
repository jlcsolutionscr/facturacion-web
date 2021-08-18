import {
  SET_LIST,
  SET_LIST_COUNT,
  SET_LIST_PAGE,
  SET_DETAILS
} from './types'

export const documentReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_LIST:
      return { ...state, list: payload.list }
    case SET_LIST_COUNT:
      return { ...state, listCount: payload.count }
    case SET_LIST_PAGE:
      return { ...state, listPage: payload.page }
    case SET_DETAILS:
      return { ...state, details: payload.details }
    default:
      return state
  }
}

export default documentReducer
