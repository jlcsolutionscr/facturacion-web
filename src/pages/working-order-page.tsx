import { useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "tss-react/mui";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import StepFourScreen from "./working-order-steps/step-four-screen";
import StepOneScreen from "./working-order-steps/step-one-screen";
import StepThreeScreen from "./working-order-steps/step-three-screen";
import StepTwoScreen from "./working-order-steps/step-two-screen";
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
    "@media screen and (max-width:960px)": {
      margin: "10px",
    },
    "@media screen and (max-width:600px)": {
      margin: "1px 0 0 0",
    },
  },
  tabs: {
    color: "#FFF",
    "& .MuiTab-root": {
      color: "#FFF",
    },
    "& .Mui-selected": {
      color: theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.light,
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

export default function WorkingOrderPage() {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.container}>
      <div className={classes.backButton}>
        <IconButton aria-label="upload picture" component="span" onClick={() => dispatch(setActiveSection(9))}>
          <BackArrowIcon className={classes.icon} />
        </IconButton>
      </div>
      <Tabs className={classes.tabs} centered value={value} indicatorColor="secondary" onChange={handleChange}>
        <Tab label="Cliente" />
        <Tab label="Detalle" />
        <Tab label="Otros" />
        <Tab label="Generar" />
      </Tabs>
      <StepOneScreen value={value} index={0} />
      <StepTwoScreen value={value} index={1} />
      <StepThreeScreen value={value} index={2} />
      <StepFourScreen value={value} index={3} />
    </div>
  );
}
