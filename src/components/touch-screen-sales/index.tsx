import { Children, cloneElement, isValidElement, ReactNode, useState } from "react";
import { makeStyles } from "tss-react/mui";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import ProductList from "./product-list";
import { TRANSITION_ANIMATION } from "utils/constants";
import { BackArrowIcon } from "utils/iconsHelper";

const useStyles = makeStyles()(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
    transition: `background-color ${TRANSITION_ANIMATION}`,
    "@media screen and (min-width:600px)": {
      width: "calc(100% - 20px)",
      margin: "10px auto",
    },
    "@media screen and (min-width:900px)": {
      maxWidth: "fit-content",
    },
  },
  mobileView: {
    height: "calc(100% - 50px)",
    width: "100%",
    display: "block",
    "@media screen and (min-width:900px)": {
      display: "none",
    },
  },
  desktopView: {
    height: "100%",
    width: "100%",
    display: "none",
    "@media screen and (min-width:900px)": {
      display: "flex",
    },
  },
  tabHeader: {
    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#08415c",
    color: "#FFF",
    borderTop: "solid 2px #FFF",
    "& .MuiTab-root": {
      color: "#FFF",
    },
    "& .Mui-selected": {
      color: "#90CAF9",
    },
    "@media screen and (min-width:600px)": {
      borderTop: "none",
    },
  },
  tabContent: {
    overflowY: "hidden",
    backgroundColor: theme.palette.background.paper,
    padding: "10px",
    width: "calc(100% - 20px)",
    height: "calc(100% - 20px)",
    "@media screen and (max-width:429px)": {
      padding: "5px",
      width: "calc(100% - 10px)",
      height: "calc(100% - 10px)",
    },
  },
  desktopContent: {
    display: "flex",
    overflowY: "hidden",
    backgroundColor: theme.palette.background.paper,
    gap: "10px",
    padding: "10px",
    width: "calc(100% - 20px)",
    height: "auto",
    maxHeight: "calc(100% - 20px)",
  },
  desktopSummary: {
    display: "flex",
    width: "calc(40% - 5px)",
    height: "auto",
    maxHeight: "-webkit-fill-available",
    alignSelf: "flex-start",
    "@media screen and (min-width:1260px)": {
      width: "calc(32% - 5px)",
    },
  },
  desktopProductList: {
    display: "flex",
    width: "calc(60% - 5px)",
    height: "fit-content",
    maxHeight: "100%",
    "@media screen and (min-width:1260px)": {
      width: "calc(68% - 5px)",
    },
  },
  backButton: {
    position: "absolute",
    marginTop: "5px",
    zIndex: "10",
  },
  icon: {
    color: "#FFF",
  },
}));

type TouchWorkingOrderPageProps = {
  addProductDetails: (id: number) => void;
  handleClose: () => void;
  children: ReactNode;
};

export default function TouchScreenSalesPage({ addProductDetails, handleClose, children }: TouchWorkingOrderPageProps) {
  const { classes } = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (_event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.container}>
      <div className={classes.mobileView}>
        <div className={classes.backButton}>
          <IconButton aria-label="back-button" component="span" onClick={() => handleClose()}>
            <BackArrowIcon className={classes.icon} />
          </IconButton>
        </div>
        <Tabs className={classes.tabHeader} centered value={value} indicatorColor="secondary" onChange={handleChange}>
          <Tab label="Resumen" />
          <Tab label="Productos" />
        </Tabs>
        <div className={classes.tabContent}>
          <div style={{ display: value === 0 ? "flex" : "none", width: "100%", maxHeight: "100%" }}>
            {Children.map(children, child => {
              if (isValidElement(child)) {
                return cloneElement(child as React.ReactElement<{ isSplitMode: boolean; value: number }>, {
                  isSplitMode: false,
                  value: value,
                });
              }
              return child;
            })}
          </div>
          <div style={{ display: value === 1 ? "flex" : "none", width: "100%", maxHeight: "100%" }}>
            <ProductList value={value} addDetails={id => addProductDetails(id)} />
          </div>
        </div>
      </div>
      <div className={classes.desktopView}>
        <div className={classes.desktopContent}>
          <div className={classes.desktopSummary}>
            {Children.map(children, child => {
              if (isValidElement(child)) {
                return cloneElement(child as React.ReactElement<{ isSplitMode: boolean }>, { isSplitMode: true });
              }
              return child;
            })}
          </div>
          <div className={classes.desktopProductList}>
            <ProductList addDetails={id => addProductDetails(id)} />
          </div>
        </div>
      </div>
    </div>
  );
}
