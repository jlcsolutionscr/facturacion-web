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
import { BackArrowIcon } from "utils/iconsHelper";

const useStyles = makeStyles()(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#08415c",
    maxWidth: "900px",
    margin: "15px auto",
    "@media screen and (max-width:959px)": {
      margin: "10px",
    },
    "@media screen and (max-width:599px)": {
      margin: "1px 0 0 0",
    },
  },
  backButton: {
    position: "absolute",
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
      <Tabs centered value={value} indicatorColor="secondary" onChange={handleChange}>
        <Tab label="Detalle" />
        <Tab label="Generar" disabled={!generateInvoice} />
      </Tabs>
      <StepOneScreen value={value} index={0} />
      <StepTwoScreen value={value} index={1} />
    </div>
  );
}
