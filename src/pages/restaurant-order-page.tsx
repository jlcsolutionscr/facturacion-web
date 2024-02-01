import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import StepOneScreen from "./restaurant-order-steps/step-one-screen";
import StepTwoScreen from "./restaurant-order-steps/step-two-screen";
import { getPermissions } from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import { TRANSITION_ANIMATION } from "utils/constants";
import { BackArrowIcon } from "utils/iconsHelper";

const useStyles = makeStyles()(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#08415c",
    maxWidth: "900px",
    width: "100%",
    margin: "15px auto",
    transition: `background-color ${TRANSITION_ANIMATION}`,
    "@media screen and (max-width:959px)": {
      width: "calc(100% - 20px)",
      margin: "10px",
    },
    "@media screen and (max-width:599px)": {
      width: "100%",
      margin: "0px",
    },
  },
  tabs: {
    color: "#FFF",
    "& .MuiTab-root": {
      color: "#FFF",
    },
    "& .Mui-selected": {
      color: "#90CAF9",
    },
    "@media screen and (max-width:599px)": {
      borderTop: "solid 2px #FFF",
    },
  },
  tab: {
    backgroundColor: theme.palette.background.paper,
    transition: `background-color ${TRANSITION_ANIMATION}`,
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
      <div className={classes.backButton}>
        <IconButton aria-label="upload picture" component="span" onClick={() => dispatch(setActiveSection(9))}>
          <BackArrowIcon className={classes.icon} />
        </IconButton>
      </div>
      <Tabs className={classes.tabs} centered value={value} indicatorColor="secondary" onChange={handleChange}>
        <Tab label="Detalle" />
        <Tab label="Generar" disabled={!generateInvoice} />
      </Tabs>
      <StepOneScreen className={classes.tab} value={value} index={0} />
      <StepTwoScreen className={classes.tab} value={value} index={1} />
    </div>
  );
}
