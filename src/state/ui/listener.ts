import { startAppListening } from "state/listener-middleware";
import { login } from "state/session/reducer";
import { setLocalPrinting, setPrinterServerAddress } from "state/ui/reducer";
import { STORAGE_LOCAL_PRINTING, STORAGE_TICKET_PRINTER_SERVER_ADDRESS } from "utils/constants";
import { LOGIN_INPUT_ID, writeKeyToStorage } from "utils/utilities";

export default function setupListeners() {
  // synchronize session ID to local storage
  startAppListening({
    actionCreator: setPrinterServerAddress,
    effect: ({ payload }) => {
      writeKeyToStorage(STORAGE_TICKET_PRINTER_SERVER_ADDRESS, payload);
    },
  });
  startAppListening({
    actionCreator: setLocalPrinting,
    effect: ({ payload }) => {
      writeKeyToStorage(STORAGE_LOCAL_PRINTING, payload);
    },
  });
  startAppListening({
    actionCreator: login,
    effect: ({ payload }) => {
      writeKeyToStorage(LOGIN_INPUT_ID, payload.Identificacion);
    },
  });
}
