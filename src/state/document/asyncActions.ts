import { createAsyncThunk } from "@reduxjs/toolkit";

import { setDocumentCount, setDocumentDetails, setDocumentList, setDocumentPage } from "state/document/reducer";
import { RootState } from "state/store";
import { setActiveSection, setMessage, startLoader, stopLoader } from "state/ui/reducer";
import { getDocumentEntity, getDocumentListCount, getDocumentListPerPage, sendDocumentEmail } from "utils/domainHelper";
import { getErrorMessage, xmlToObject } from "utils/utilities";

export const getDocumentListFirstPage = createAsyncThunk(
  "document/getDocumentListFirstPage",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    dispatch(setDocumentList([]));
    if (payload.id) dispatch(setActiveSection(payload.id));
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
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
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
      const newList = await getDocumentListPerPage(token, companyId, branchId, payload.pageNumber, 10);
      dispatch(setDocumentPage(payload.pageNumber));
      dispatch(setDocumentList(newList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const sendNotification = createAsyncThunk(
  "document/sendNotification",
  async (payload: { id: number; emailTo: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    try {
      await sendDocumentEmail(token, payload.id, payload.emailTo);
      dispatch(
        setMessage({
          message: "Correo enviado satisfactoriamente.",
          type: "INFO",
        })
      );
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getDocumentDetails = createAsyncThunk(
  "document/sendNotification",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    try {
      const response = await getDocumentEntity(token, payload.id);
      const { MensajeHacienda } = xmlToObject(response.Respuesta);
      dispatch(setDocumentDetails(MensajeHacienda.DetalleMensaje));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);
