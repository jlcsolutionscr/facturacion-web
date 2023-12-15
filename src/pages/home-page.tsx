import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";

import BannerImage from "assets/img/home-background.webp";
import Header from "components/header";
/*import MenuPage from "pages/menu-page";
import CompanyPage from "pages/company-page";
import LogoPage from "pages/logo-page";
import CustomerListPage from "pages/customer-list-page";
import CustomerPage from "pages/customer-page";
import ProductListPage from "pages/product-list-page";
import ProductPage from "pages/product-page";
import InvoicePage from "pages/invoice-page";
import ReceiptPage from "pages/receipt-page";
import WorkingOrderListPage from "pages/working-order-list-page";
import RestaurantOrderListPage from "pages/restaurant-order-list-page";
import WorkingOrderPage from "pages/working-order-page";
import RestaurantOrderPage from "pages/restaurant-order-page";
import InvoiceListPage from "pages/invoice-list-page";
import DocumentListPage from "pages/document-list-page";
import ReportsPage from "pages/reports-page";*/
import { userLogout } from "state/session/asyncActions";
import { getCompany } from "state/session/reducer";
import { getActiveSection } from "state/ui/reducer";

interface HomePageProps {
  width: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function HomePage({
  width,
  isDarkMode,
  toggleDarkMode,
}: HomePageProps) {
  const myRef = React.useRef<HTMLDivElement>(null);

  const activeSection = useSelector(getActiveSection);
  const company = useSelector(getCompany);

  React.useEffect(() => {
    myRef.current?.scrollTo(0, 0);
  }, [activeSection]);

  return (
    <Box
      id="id_home_page"
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minWidth: `${width}px`,
        "@media screen and (max-width: 414px)": {
          backgroundImage: "none",
          backgroundColor: "#FFF",
        },
      }}
    >
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <Box
        ref={myRef}
        sx={{
          backgroundImage: `url(${BannerImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `100% 100%`,
          display: "flex",
          flex: "1 1 auto",
          overflowY: "auto",
          overflowX: "hidden",
          backgroundColor: "#FFF",
          padding: "0px 10% 20px 10%",
          "@media screen and (max-width: 960px)": {
            padding: "0 16px 16px 16px",
          },
          "@media screen and (max-width: 600px)": {
            padding: "0 13px 13px 13px",
          },
          "@media screen and (max-width: 414px)": {
            backgroundImage: `none`,
            padding: "0 10px 10px 10px",
          },
        }}
      >
        Home Page
        {/*activeSection === 0 && <MenuPage />}
        {activeSection === 1 && <CompanyPage />}
        {activeSection === 2 && <LogoPage />}
        {activeSection === 3 && <CustomerListPage />}
        {activeSection === 4 && <ProductListPage />}
        {activeSection === 5 && <InvoicePage />}
        {activeSection === 6 && <ReceiptPage />}
        {activeSection === 7 && <InvoiceListPage />}
        {activeSection === 8 && <DocumentListPage />}
        {activeSection === 9 ? (
          company?.mode === 1 ? (
            <WorkingOrderListPage />
          ) : (
            <RestaurantOrderListPage />
          )
        ) : null}
        {activeSection === 20 && <ReportsPage width={width} />}
        {activeSection === 21 ? (
          company?.mode === 1 ? (
            <WorkingOrderPage />
          ) : (
            <RestaurantOrderPage />
          )
        ) : null}
        {activeSection === 22 && <CustomerPage />}
        {activeSection === 23 && <ProductPage />*/}
      </Box>
    </Box>
  );
}