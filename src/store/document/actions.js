import { SET_LIST, SET_LIST_COUNT, SET_LIST_PAGE, SET_DETAILS } from "./types";

import { startLoader, stopLoader, setMessage, setActiveSection } from "store/ui/actions";

import {
  getDocumentListCount,
  getDocumentListPerPage,
  sendDocumentByEmail,
  getDocumentEntity,
} from "utils/domainHelper";

import { xmlToObject } from "utils/utilities";

export const setDocumentList = list => {
  return {
    type: SET_LIST,
    payload: { list },
  };
};

export const setDocumentCount = count => {
  return {
    type: SET_LIST_COUNT,
    payload: { count },
  };
};

export const setDocumentPage = page => {
  return {
    type: SET_LIST_PAGE,
    payload: { page },
  };
};

export const setDocumentDetails = details => {
  return {
    type: SET_DETAILS,
    payload: { details },
  };
};

export const getDocumentListFirstPage = id => {
  return async (dispatch, getState) => {
    const { token, companyId, branchId } = getState().session;
    dispatch(startLoader());
    try {
      dispatch(setDocumentPage(1));
      const recordCount = await getDocumentListCount(token, companyId, branchId);
      dispatch(setDocumentCount(recordCount));
      if (recordCount > 0) {
        const newList = await getDocumentListPerPage(token, companyId, branchId, 1, 10);
        dispatch(setDocumentList(newList));
      } else {
        dispatch(setDocumentList([]));
      }
      if (id) dispatch(setActiveSection(id));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(stopLoader());
    }
  };
};

export const getDocumentListByPageNumber = pageNumber => {
  return async (dispatch, getState) => {
    const { token, companyId, branchId } = getState().session;
    dispatch(startLoader());
    try {
      const newList = await getDocumentListPerPage(token, companyId, branchId, pageNumber, 10);
      dispatch(setDocumentPage(pageNumber));
      dispatch(setDocumentList(newList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(stopLoader());
    }
  };
};

export const sendNotification = (idDocument, emailTo) => {
  return async (dispatch, getState) => {
    const { token } = getState().session;
    dispatch(startLoader());
    try {
      await sendDocumentByEmail(token, idDocument, emailTo);
      dispatch(setMessage("Correo enviado satisfactoriamente.", "INFO"));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
};

export const getDocumentDetails = idDocument => {
  return async (dispatch, getState) => {
    const { token } = getState().session;
    dispatch(startLoader());
    try {
      const response = await getDocumentEntity(token, idDocument);
      const details = xmlToObject(response.Respuesta);
      dispatch(setDocumentDetails(details.DetalleMensaje));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message || error));
      dispatch(stopLoader());
    }
  };
};
