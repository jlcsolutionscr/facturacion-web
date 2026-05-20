import { useSelector } from "react-redux";

import InvoiceStepsPage from "./steps";
import InvoiceTouchScreenPage from "./touch-screen";
import { getCompany } from "state/session/reducer";

export default function InvoicePage() {
  const company = useSelector(getCompany);

  if (company?.Modalidad === 1) return <InvoiceStepsPage />;
  return <InvoiceTouchScreenPage />;
}
