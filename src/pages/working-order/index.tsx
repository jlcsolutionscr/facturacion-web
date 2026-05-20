import { useSelector } from "react-redux";

import WorkingOrderStepsPage from "./steps";
import WorkingOrderTouchScreenPage from "./touch-screen";
import { getCompany } from "state/session/reducer";

export default function WorkingOrder() {
  const company = useSelector(getCompany);

  if (company?.Modalidad === 1) return <WorkingOrderStepsPage />;
  return <WorkingOrderTouchScreenPage />;
}
