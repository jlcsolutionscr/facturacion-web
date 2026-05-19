import { useSelector } from "react-redux";

import WorkingOrderListPage from "./steps/list-page";
import TouchScreenWorkingOrderListPage from "./touch-screen/list-page";
import { getCompany } from "state/session/reducer";

export default function WorkingOrder() {
  const company = useSelector(getCompany);

  if (company?.Modalidad === 1) return <WorkingOrderListPage />;
  return <TouchScreenWorkingOrderListPage />;
}
