import { startAppListening } from "state/listener-middleware";
import { setTicketPrinterName } from "state/ui/reducer";
import { STORAGE_TICKET_PRINTER } from "utils/constants";
import { writeKeyToStorage } from "utils/utilities";

export default function setupListeners() {
  // synchronize session ID to local storage
  startAppListening({
    actionCreator: setTicketPrinterName,
    effect: ({ payload }) => {
      writeKeyToStorage(STORAGE_TICKET_PRINTER, payload);
    },
  });
}
