import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "state/store";
import {
  setDocumentPage,
  setDocumentCount,
  setDocumentList,
  setDocumentDetails,
} from "state/document/reducer";
import {
  startLoader,
  stopLoader,
  setMessage,
  setActiveSection,
} from "state/ui/reducer";
import {
  getDocumentListCount,
  getDocumentListPerPage,
  sendDocumentByEmail,
  getDocumentEntity,
} from "utils/domainHelper";

import { getErrorMessage, xmlToObject } from "utils/utilities";

export const getDocumentListFirstPage = createAsyncThunk(
  "document/getDocumentListFirstPage",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      dispatch(setDocumentPage(1));
      const recordCount = await getDocumentListCount(
        token,
        companyId,
        branchId
      );
      dispatch(setDocumentCount(recordCount));
      if (recordCount > 0) {
        const newList = await getDocumentListPerPage(
          token,
          companyId,
          branchId,
          1,
          10
        );
        dispatch(setDocumentList(newList));
      } else {
        dispatch(setDocumentList([]));
      }
      if (payload.id) dispatch(setActiveSection(payload.id));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const getDocumentListByPageNumber = createAsyncThunk(
  "document/getDocumentListFirstPage",
  async (payload: { pageNumber: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      const newList = await getDocumentListPerPage(
        token,
        companyId,
        branchId,
        payload.pageNumber,
        10
      );
      dispatch(setDocumentPage(payload.pageNumber));
      dispatch(setDocumentList(newList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const sendNotification = createAsyncThunk(
  "document/sendNotification",
  async (
    payload: { idDocument: number; emailTo: string },
    { getState, dispatch }
  ) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    try {
      await sendDocumentByEmail(token, payload.idDocument, payload.emailTo);
      dispatch(
        setMessage({
          error: "Correo enviado satisfactoriamente.",
          type: "INFO",
        })
      );
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const getDocumentDetails = createAsyncThunk(
  "document/sendNotification",
  async (payload: { idDocument: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    try {
      const response = await getDocumentEntity(token, payload.idDocument);
      const details = xmlToObject(response.Respuesta);
      dispatch(setDocumentDetails(details.DetalleMensaje));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);