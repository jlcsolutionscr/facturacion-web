import BannerImage from "assets/img/home-background.webp";
import CompanyPage from "pages/company-page";
import CustomerListPage from "pages/customer-list-page";
import DocumentListPage from "pages/document-list-page";
import InvoiceListPage from "pages/invoice-list-page";
import InvoicePage from "pages/invoice-page";
import LogoPage from "pages/logo-page";
import MenuPage from "pages/menu-page";
import ProductListPage from "pages/product-list-page";
import RestaurantOrderListPage from "pages/restaurant-order-list-page";
import RestaurantOrderPage from "pages/restaurant-order-page";
//import ReceiptPage from "pages/receipt-page";
import WorkingOrderListPage from "pages/working-order-list-page";
import WorkingOrderPage from "pages/working-order-page";
import React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";

import Header from "components/header";
//import ReportsPage from "pages/reports-page";*/
import { getCompany } from "state/session/reducer";
import { getActiveSection } from "state/ui/reducer";

const useStyles = makeStyles()(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    "@media screen and (max-width:430px)": {
      backgroundImage: "none",
      backgroundColor: "#FFF",
    },
  },
  body: {
    backgroundImage: `url(${BannerImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `100% 100%`,
    display: "flex",
    flex: "1 1 auto",
    overflowY: "auto",
    overflowX: "hidden",
    backgroundColor: "#FFF",
    "@media screen and (max-width:430px)": {
      backgroundImage: `none`,
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
  const myRef = React.useRef<HTMLDivElement>(null);

  const activeSection = useSelector(getActiveSection);
  const company = useSelector(getCompany);

  React.useEffect(() => {
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
        {/*activeSection === 6 && <ReceiptPage />*/}
        {activeSection === 7 && <InvoiceListPage />}
        {activeSection === 8 && <DocumentListPage />}
        {activeSection === 9 ? company?.Modalidad === 1 ? <WorkingOrderListPage /> : <RestaurantOrderListPage /> : null}
        {/*activeSection === 20 && <ReportsPage width={width} />*/}
        {activeSection === 21 ? company?.Modalidad === 1 ? <WorkingOrderPage /> : <RestaurantOrderPage /> : null}
      </div>
    </div>
  );
}
