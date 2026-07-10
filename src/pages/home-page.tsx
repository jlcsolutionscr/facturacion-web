import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Dialog from "@mui/material/Dialog";

import BannerImage from "assets/img/home-background.webp";
import Header from "components/header-bar";
import CashCloseDialogPage from "pages/cash-close-dialog-page";
import CashClosingListPage from "pages/cash-closing/list-page";
import CategoryPage from "pages/category";
import CategoryLisPage from "pages/category/list-page";
import CompanyPage from "pages/company";
import CustomerPage from "pages/customer";
import CustomerCreditNote from "pages/customer-credit-note";
import CustomerListPage from "pages/customer/list-page";
import DocumentListPage from "pages/document";
import InvoicePage from "pages/invoice";
import InvoiceListPage from "pages/invoice/list-page";
import MenuPage from "pages/menu-page";
import ServicePointPage from "pages/point-of-service";
import ServicePointListPage from "pages/point-of-service/list-page";
import PrinterServiceConfig from "pages/printer-service-config-page";
import ProductPage from "pages/product";
import ProductListPage from "pages/product/list-page";
import ProformaPage from "pages/proforma";
import ProformaListPage from "pages/proforma/list-page";
import ReceiptPage from "pages/receipt-page";
import ReportsPage from "pages/reports-page";
import UserPage from "pages/user-page";
import WorkingOrderPage from "pages/working-order";
import WorkingOrderListPage from "pages/working-order/list";
import { abortCashCloseProcess } from "state/session/asyncActions";
import { getIsCashCloseSaved } from "state/session/reducer";
import { getActiveSection, setActiveSection } from "state/ui/reducer";
import { TRANSITION_ANIMATION } from "utils/constants";

const useStyles = makeStyles()(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  body: {
    backgroundImage: `url(${BannerImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `100% 100%`,
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    scrollbarWidth: "thin",
    transition: `background-color ${TRANSITION_ANIMATION}`,
    "@media screen and (max-width:429px)": {
      backgroundImage: "none",
      backgroundColor: theme.palette.mode === "dark" ? "hsl(210, 14%, 7%)" : "rgb(255, 255, 255)",
    },
  },
}));

interface HomePageProps {
  width: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function HomePage({ width, isDarkMode, toggleDarkMode }: HomePageProps) {
  const [isCashCloseDialogOpen, setIsCashCloseDialogOpen] = useState({ new: false, open: false, id: 0 });
  const { classes } = useStyles();
  const containeRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const activeSection = useSelector(getActiveSection);
  const isCashClosedSaved = useSelector(getIsCashCloseSaved);

  useEffect(() => {
    return () => {
      dispatch(setActiveSection(0));
    };
  }, [dispatch]);

  useEffect(() => {
    containeRef.current?.scrollTo(0, 0);
  }, [activeSection]);

  const handleCashCloseDialogCancel = () => {
    if (isCashCloseDialogOpen.new && !isCashClosedSaved) dispatch(abortCashCloseProcess());
    setIsCashCloseDialogOpen({ new: false, open: false, id: 0 });
  };

  return (
    <div id="id_home_page" className={classes.root} style={{ minWidth: `${width}px` }}>
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        setIsCashCloseDialogOpen={setIsCashCloseDialogOpen}
      />
      <div ref={containeRef} className={classes.body}>
        {activeSection === 0 && <MenuPage />}
        {activeSection === 1 && <CompanyPage />}
        {activeSection === 2 && <UserPage />}
        {activeSection === 4 && <CustomerListPage />}
        {activeSection === 5 && <ProductListPage />}
        {activeSection === 6 && <InvoicePage />}
        {activeSection === 7 && <ReceiptPage />}
        {activeSection === 8 && <InvoiceListPage />}
        {activeSection === 9 && <DocumentListPage />}
        {activeSection === 10 && <ProformaListPage />}
        {activeSection === 11 && <WorkingOrderListPage />}
        {activeSection === 12 && <CustomerPage />}
        {activeSection === 13 && <ProductPage />}
        {activeSection === 14 && <ProformaPage />}
        {activeSection === 15 && <WorkingOrderPage />}
        {activeSection === 16 && <CategoryLisPage />}
        {activeSection === 17 && <CategoryPage />}
        {activeSection === 18 && <ServicePointListPage />}
        {activeSection === 19 && <ServicePointPage />}
        {activeSection === 20 && <ReportsPage />}
        {activeSection === 21 && <PrinterServiceConfig />}
        {activeSection === 22 && <CashClosingListPage setIsCashCloseDialogOpen={setIsCashCloseDialogOpen} />}
        {activeSection === 23 && <CustomerCreditNote />}
      </div>
      <Dialog id="revoke-dialog" onClose={handleCashCloseDialogCancel} open={isCashCloseDialogOpen.open}>
        <CashCloseDialogPage
          isNew={isCashCloseDialogOpen.new}
          id={isCashCloseDialogOpen.id}
          onDialogClose={handleCashCloseDialogCancel}
        />
      </Dialog>
    </div>
  );
}
