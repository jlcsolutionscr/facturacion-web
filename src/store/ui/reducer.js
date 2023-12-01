import {
  START_LOADER,
  STOP_LOADER,
  SET_ACTIVE_SECTION,
  SET_ERROR_MESSAGE,
  SET_CANTON_LIST,
  SET_DISTRITO_LIST,
  SET_BARRIO_LIST,
  SET_RENT_TYPE_LIST,
  SET_EXONERATION_TYPE_LIST,
  SET_ID_TYPE_LIST,
} from "./types";

import { LOGOUT } from "store/session/types";

const uiReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case START_LOADER:
      return { ...state, isLoaderOpen: true, loaderText: payload.text !== undefined ? payload.text : "Procesando" };
    case STOP_LOADER:
      return { ...state, isLoaderOpen: false, loaderText: "" };
    case SET_ACTIVE_SECTION:
      return { ...state, activeSection: payload.pageId };
    case SET_ERROR_MESSAGE:
      return { ...state, message: payload.error, messageType: payload.type };
    case SET_CANTON_LIST:
      return { ...state, cantonList: payload.list };
    case SET_DISTRITO_LIST:
      return { ...state, distritoList: payload.list };
    case SET_BARRIO_LIST:
      return { ...state, barrioList: payload.list };
    case SET_RENT_TYPE_LIST:
      return { ...state, rentTypeList: payload.list };
    case SET_EXONERATION_TYPE_LIST:
      return { ...state, exonerationTypeList: payload.list };
    case SET_ID_TYPE_LIST:
      return { ...state, idTypeList: payload.list };
    case LOGOUT:
      return { ...state, activeSection: 0 };
    default:
      return state;
  }
};

export default uiReducer;
