import { makeStyles } from "tss-react/mui";

import LogoDarkImage from "assets/img/company-logo-dark.webp";
import { TRANSITION_ANIMATION } from "utils/constants";

export const useStyles = makeStyles()(theme => ({
  header: {
    backgroundImage: "linear-gradient(to bottom, rgba(8, 65, 92, 0.6), rgba(8, 65, 92, 0.9), rgba(8, 65, 92, 1))",
    minHeight: "140px",
  },
  banner: {
    backgroundImage: `url(${LogoDarkImage})`,
    backgroundRepeat: "no-repeat",
    position: "absolute",
    backgroundSize: "75px 75px",
    backgroundPosition: "10px 0",
    left: "0",
    height: "105px",
    top: "10px",
    width: "100%",
  },
  toogle: {
    position: "absolute",
    top: "89px",
    right: "52px",
    zIndex: 2,
  },
  logout: {
    position: "absolute",
    top: "89px",
    right: "8px",
    zIndex: 2,
  },
  text: {
    textAlign: "left",
    margin: "20px 0 0 100px",
  },
  h2: {
    color: theme.palette.mode === "dark" ? "#333" : "#08415c",
    fontFamily: "Russo One",
    fontStyle: "italic",
    fontSize: theme.typography.pxToRem(20),
    textShadow: "1px 1px 3px #FFF",
    transition: `color ${TRANSITION_ANIMATION}`,
  },
  h4: {
    marginTop: "8px",
    color: "#E2EBF1",
    fontFamily: "Russo One",
    fontStyle: "italic",
    fontSize: theme.typography.pxToRem(13),
    textShadow: "2px 2px 3px rgba(0,0,0,0.85)",
  },
  title: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    textAlign: "center",
    width: "100%",
    right: "0",
    top: "0",
    marginLeft: "0",
    "@media screen and (min-width:900px)": {
      position: "absolute",
      top: theme.spacing(4),
    },
  },
  companyText: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "'Exo 2', sans-serif",
    fontSize: theme.typography.pxToRem(20),
    fontStyle: "italic",
    fontWeight: 600,
    textShadow: "4px 4px 6px rgba(0,0,0,0.45)",
    marginBottom: 0,
    "@media screen and (min-width:600px)": {
      fontSize: theme.typography.pxToRem(25),
    },
  },
  icon: {
    color: "#FFF",
  },
}));
