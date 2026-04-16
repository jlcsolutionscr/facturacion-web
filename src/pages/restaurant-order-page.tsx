import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Grid from "@mui/material/Unstable_Grid2";

import StepTwoScreen from "./steps-screens/restaurant-final-screen";
import StepOneScreen from "./steps-screens/restaurant-first-screen";
import { getPermissions } from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import { TRANSITION_ANIMATION } from "utils/constants";
import { BackArrowIcon } from "utils/iconsHelper";

const useStyles = makeStyles()(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "500px",
    width: "100%",
    height: "100%",
    margin: "0 auto",
    transition: `background-color ${TRANSITION_ANIMATION}`,
    "@media screen and (min-width:600px)": {
      width: "calc(100% - 20px)",
      margin: "10px auto",
      height: "calc(100% - 20px)",
    },
    "@media screen and (min-width:900px)": {
      maxWidth: "1300px",
    },
  },
  mobileView: {
    height: "100%",
    display: "block",
    "@media screen and (min-width:900px)": {
      display: "none",
    },
  },
  desktopView: {
    height: "100%",
    display: "none",
    "@media screen and (min-width:900px)": {
      display: "block",
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
    transition: `background-color ${TRANSITION_ANIMATION}`,
    padding: "20px",
    width: "calc(100% - 40px)",
    height: "calc(100% - 40px)",
    "@media screen and (max-width:900px)": {
      padding: "15px",
      width: "calc(100% - 30px)",
      height: "calc(100% - 78px)",
    },
    "@media screen and (max-width:599px)": {
      padding: "10px",
      width: "calc(100% - 20px)",
      height: "calc(100% - 70px)",
    },
    "@media screen and (max-width:429px)": {
      padding: "5px",
      width: "calc(100% - 10px)",
      height: "calc(100% - 60px)",
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

export default function RestaurantOrderPage() {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);

  const permissions = useSelector(getPermissions);

  const handleChange = (_event: any, newValue: number) => {
    setValue(newValue);
  };

  const generateInvoice = permissions.filter(role => [1, 203].includes(role.IdRole)).length > 0;

  return (
    <div className={classes.container}>
      <div className={classes.mobileView}>
        <div className={classes.backButton}>
          <IconButton aria-label="back-button" component="span" onClick={() => dispatch(setActiveSection(11))}>
            <BackArrowIcon className={classes.icon} />
          </IconButton>
        </div>
        <Tabs className={classes.tabHeader} centered value={value} indicatorColor="secondary" onChange={handleChange}>
          <Tab label="Detalle" />
          <Tab label="Generar" disabled={!generateInvoice} />
        </Tabs>
        <div className={classes.tabContent}>
          <div style={{ display: value === 0 ? "flex" : "none", height: "100%" }}>
            <StepOneScreen value={value} />
          </div>
          <div style={{ display: value === 1 ? "flex" : "none", height: "100%" }}>
            <StepTwoScreen isSplitMode={false} value={value} />
          </div>
        </div>
      </div>
      <div className={classes.desktopView}>
        <div className={classes.tabContent}>
          <Grid container justifyContent="space-between" sx={{ height: "100%" }}>
            <Grid sx={{ width: { sm: "45%", md: "48%", paddingRight: "5px" }, height: "100%" }} overflow="auto">
              <StepTwoScreen isSplitMode />
            </Grid>
            <Grid sx={{ width: "50%", height: "100%" }} overflow="auto">
              <StepOneScreen />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
