import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Dialog from "@mui/material/Dialog";

import BannerImage from "assets/img/home-background.webp";
import Header from "components/header-bar";
import CashCloseDialogPage from "pages/cash-close-dialog-page";
import CategoryPage from "pages/category";
import CategoryLisPage from "pages/category/list-page";
import CompanyPage from "pages/company";
import CustomerPage from "pages/customer";
import CustomerListPage from "pages/customer/list-page";
import DocumentListPage from "pages/document";
import InvoicePage from "pages/invoice";
import InvoiceListPage from "pages/invoice/invoice-list-page";
import MenuPage from "pages/menu-page";
import PrinterServiceConfig from "pages/printer-service-config-page";
import ProductPage from "pages/product";
import ProductListPage from "pages/product/list-page";
import ProformaPage from "pages/proforma";
import ProformaListPage from "pages/proforma/proforma-list-page";
import ReceiptPage from "pages/receipt-page";
import ReportsPage from "pages/reports-page";
import RestaurantOrderPage from "pages/restaurant";
import RestaurantOrderListPage from "pages/restaurant/list-page";
import UserPage from "pages/user-page";
import WorkingOrderPage from "pages/working-order";
import WorkingOrderListPage from "pages/working-order/list-page";
import { abortCashCloseProcess } from "state/session/asyncActions";
import { getCompany, getIsCashCloseSaved } from "state/session/reducer";
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
  const [isCashCloseDialogOpen, setIsCashCloseDialogOpen] = useState(false);
  const { classes } = useStyles();
  const containeRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const activeSection = useSelector(getActiveSection);
  const company = useSelector(getCompany);
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
    if (!isCashClosedSaved) dispatch(abortCashCloseProcess());
    setIsCashCloseDialogOpen(false);
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
        {activeSection === 11 ? (
          company?.Modalidad === 1 ? (
            <WorkingOrderListPage />
          ) : (
            <RestaurantOrderListPage />
          )
        ) : null}
        {activeSection === 12 && <CustomerPage />}
        {activeSection === 13 && <ProductPage />}
        {activeSection === 14 && <ProformaPage />}
        {activeSection === 15 ? company?.Modalidad === 1 ? <WorkingOrderPage /> : <RestaurantOrderPage /> : null}
        {activeSection === 16 && <CategoryLisPage />}
        {activeSection === 17 && <CategoryPage />}
        {activeSection === 20 && <ReportsPage />}
        {activeSection === 21 && <PrinterServiceConfig />}
      </div>
      <Dialog id="revoke-dialog" onClose={handleCashCloseDialogCancel} open={isCashCloseDialogOpen}>
        <CashCloseDialogPage onDialogClose={handleCashCloseDialogCancel} />
      </Dialog>
    </div>
  );
}
