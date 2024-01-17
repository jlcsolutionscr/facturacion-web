import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "tss-react/mui";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import StepFourScreen from "./working-order-steps/step-four-screen";
import StepOneScreen from "./working-order-steps/step-one-screen";
import StepThreeScreen from "./working-order-steps/step-three-screen";
import StepTwoScreen from "./working-order-steps/step-two-screen";
import { setActiveSection } from "state/ui/actions";
import { BackArrowIcon } from "utils/iconsHelper";

const useStyles = makeStyles()(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#08415c",
    color: "#FFF",
    maxWidth: "900px",
    margin: "10px auto 0 auto",
  },
  backButton: {
    position: "absolute",
    zIndex: "10",
  },
  icon: {
    color: "#FFF",
  },
}));

function WorkingOrderPage({ setActiveSection }) {
  const { classes } = useStyles();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className={classes.container}>
      <div className={classes.backButton}>
        <IconButton aria-label="upload picture" component="span" onClick={() => setActiveSection(9)}>
          <BackArrowIcon className={classes.icon} />
        </IconButton>
      </div>
      <Tabs centered value={value} indicatorColor="secondary" onChange={handleChange}>
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

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setActiveSection }, dispatch);
};

export default connect(null, mapDispatchToProps)(WorkingOrderPage);
