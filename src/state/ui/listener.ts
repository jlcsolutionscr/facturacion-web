import { startAppListening } from "state/listener-middleware";
import { login } from "state/session/reducer";
import { setPrinterServerAddress } from "state/ui/reducer";
import { STORAGE_TICKET_PRINTER_SERVER_ADDRESS } from "utils/constants";
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
    actionCreator: login,
    effect: ({ payload }) => {
      writeKeyToStorage(LOGIN_INPUT_ID, payload.Identificacion);
    },
  });
}
