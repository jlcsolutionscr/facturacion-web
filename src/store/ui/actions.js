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

import { getCantonList, getDistritoList, getBarrioList } from "utils/domainHelper";

export const startLoader = text => {
  return {
    type: START_LOADER,
    payload: { text },
  };
};

export const stopLoader = () => {
  return {
    type: STOP_LOADER,
  };
};

export const setActiveSection = pageId => {
  return {
    type: SET_ACTIVE_SECTION,
    payload: { pageId },
  };
};

export const setMessage = (error, type = "ERROR") => {
  return {
    type: SET_ERROR_MESSAGE,
    payload: { error, type },
  };
};

export const setCantonList = list => {
  return {
    type: SET_CANTON_LIST,
    payload: { list },
  };
};

export const setDistritoList = list => {
  return {
    type: SET_DISTRITO_LIST,
    payload: { list },
  };
};

export const setBarrioList = list => {
  return {
    type: SET_BARRIO_LIST,
    payload: { list },
  };
};

export const setRentTypeList = list => {
  return {
    type: SET_RENT_TYPE_LIST,
    payload: { list },
  };
};

export const setExonerationTypeList = list => {
  return {
    type: SET_EXONERATION_TYPE_LIST,
    payload: { list },
  };
};

export const setIdTypeList = list => {
  return {
    type: SET_ID_TYPE_LIST,
    payload: { list },
  };
};

export function updateCantonList(idProvincia) {
  return async (dispatch, getState) => {
    const { token } = getState().session;
    dispatch(startLoader());
    try {
      const cantonList = await getCantonList(token, idProvincia);
      dispatch(setCantonList(cantonList));
      const distritoList = await getDistritoList(token, idProvincia, 1);
      dispatch(setDistritoList(distritoList));
      const barrioList = await getBarrioList(token, idProvincia, 1, 1);
      dispatch(setBarrioList(barrioList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
}

export function updateDistritoList(idProvincia, idCanton) {
  return async (dispatch, getState) => {
    const { token } = getState().session;
    dispatch(startLoader());
    try {
      const distritoList = await getDistritoList(token, idProvincia, idCanton);
      dispatch(setDistritoList(distritoList));
      const barrioList = await getBarrioList(token, idProvincia, idCanton, 1);
      dispatch(setBarrioList(barrioList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
}

export function updateBarrioList(idProvincia, idCanton, idDistrito) {
  return async (dispatch, getState) => {
    const { token } = getState().session;
    dispatch(startLoader());
    try {
      const barrioList = await getBarrioList(token, idProvincia, idCanton, idDistrito);
      dispatch(setBarrioList(barrioList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
}
