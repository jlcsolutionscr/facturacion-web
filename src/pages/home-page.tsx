import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";

import BannerImage from "assets/img/home-background.webp";
import Header from "components/header";
import CompanyPage from "pages/company-page";
import CustomerListPage from "pages/customer-list-page";
import CustomerPage from "pages/customer-page";
import DocumentListPage from "pages/document-list-page";
import InvoiceListPage from "pages/invoice-list-page";
import InvoicePage from "pages/invoice-page";
import LogoPage from "pages/logo-page";
import MenuPage from "pages/menu-page";
import ProductListPage from "pages/product-list-page";
import ProductPage from "pages/product-page";
import ProformaListPage from "pages/proforma-list-page";
import ProformaPage from "pages/proforma-page";
import ReceiptPage from "pages/receipt-page";
import ReportsPage from "pages/reports-page";
import RestaurantOrderListPage from "pages/restaurant-order-list-page";
import RestaurantOrderPage from "pages/restaurant-order-page";
import WorkingOrderListPage from "pages/working-order-list-page";
import WorkingOrderPage from "pages/working-order-page";
import { getCompany } from "state/session/reducer";
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
    overflowY: "auto",
    overflowX: "hidden",
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
  const { classes } = useStyles();
  const myRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const activeSection = useSelector(getActiveSection);
  const company = useSelector(getCompany);

  useEffect(() => {
    return () => {
      dispatch(setActiveSection(0));
    };
  }, [dispatch]);

  useEffect(() => {
    myRef.current?.scrollTo(0, 0);
  }, [activeSection]);

  return (
    <div id="id_home_page" className={classes.root} style={{ minWidth: `${width}px` }}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div ref={myRef} className={classes.body}>
        {activeSection === 0 && <MenuPage />}
        {activeSection === 1 && <CompanyPage />}
        {activeSection === 2 && <LogoPage />}
        {activeSection === 3 && <CustomerListPage />}
        {activeSection === 4 && <ProductListPage />}
        {activeSection === 5 && <InvoicePage />}
        {activeSection === 6 && <ReceiptPage />}
        {activeSection === 7 && <InvoiceListPage />}
        {activeSection === 8 && <DocumentListPage />}
        {activeSection === 9 ? company?.Modalidad === 1 ? <WorkingOrderListPage /> : <RestaurantOrderListPage /> : null}
        {activeSection === 10 && <ProformaListPage />}
        {activeSection === 11 && <CustomerPage />}
        {activeSection === 12 && <ProductPage />}
        {activeSection === 13 && <ProformaPage />}
        {activeSection === 14 ? company?.Modalidad === 1 ? <WorkingOrderPage /> : <RestaurantOrderPage /> : null}
        {activeSection === 20 && <ReportsPage />}
      </div>
    </div>
  );
}
