import { startAppListening } from "state/listener-middleware";
import { setPrinterServerAddress } from "state/ui/reducer";
import { STORAGE_TICKET_PRINTER_SERVER_ADDRESS } from "utils/constants";
import { writeKeyToStorage } from "utils/utilities";

export default function setupListeners() {
  // synchronize session ID to local storage
  startAppListening({
    actionCreator: setPrinterServerAddress,
    effect: ({ payload }) => {
      writeKeyToStorage(STORAGE_TICKET_PRINTER_SERVER_ADDRESS, payload);
    },
  });
}
