import { useSelector } from "react-redux";

import WorkingOrderPage from "./steps";
import TouchScreenWorkingOrderPage from "./touch-screen";
import { getCompany } from "state/session/reducer";

export default function WorkingOrder() {
  const company = useSelector(getCompany);

  if (company?.Modalidad === 1) return <WorkingOrderPage />;
  return <TouchScreenWorkingOrderPage />;
}
