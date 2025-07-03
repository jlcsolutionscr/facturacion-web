import { createAsyncThunk } from "@reduxjs/toolkit";

import { setCantonList, setDistritoList, setMessage, startLoader, stopLoader } from "./reducer";
import { RootState } from "state/store";
import { getCantonList, getDistritoList } from "utils/domainHelper";
import { getErrorMessage } from "utils/utilities";

export const updateCantonList = createAsyncThunk(
  "ui/updateCantonList",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    try {
      const cantonList = await getCantonList(token, payload.id);
      dispatch(setCantonList(cantonList));
      const distritoList = await getDistritoList(token, payload.id, 1);
      dispatch(setDistritoList(distritoList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const updateDistritoList = createAsyncThunk(
  "ui/updateDistritoList",
  async (payload: { id: number; subId: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    try {
      const distritoList = await getDistritoList(token, payload.id, payload.subId);
      dispatch(setDistritoList(distritoList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);
