import LogoDarkImage from "assets/img/company-logo-dark.webp";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()(theme => ({
  header: {
    backgroundImage: `linear-gradient(to bottom, ${
      theme.palette.mode === "dark" ? "rgba(51, 51, 51, 0.6)" : "rgba(8, 65, 92, 0.6)"
    }, ${theme.palette.mode === "dark" ? "rgba(51, 51, 51, 0.9)" : "rgba(8, 65, 92, 0.9)"}, ${
      theme.palette.mode === "dark" ? "rgba(51, 51, 51, 1)" : "rgba(8, 65, 92, 1)"
    })`,
    minHeight: "140px",
  },
  banner: {
    backgroundImage: `url(${LogoDarkImage})`,
    backgroundRepeat: "no-repeat",
    position: "absolute",
    backgroundSize: "105px 105px",
    backgroundPosition: "10px 0",
    top: "10px",
    left: "0",
    height: "145px",
    width: "100%",
    "@media screen and (max-width:600px)": {
      backgroundSize: "75px 75px",
      height: "105px",
      top: "10px",
    },
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
    margin: "30px 0 0 120px",
    "@media screen and (max-width:600px)": {
      margin: "20px 0 0 100px",
    },
  },
  h2: {
    color: theme.palette.mode === "dark" ? "#333" : "#08415c",
    fontFamily: "Russo One",
    fontStyle: "italic",
    fontSize: theme.typography.pxToRem(25),
    textShadow: "1px 1px 3px #FFF",
    "@media screen and (max-width:600px)": {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  h4: {
    marginTop: "8px",
    color: "#E2EBF1",
    fontFamily: "Russo One",
    fontStyle: "italic",
    fontSize: theme.typography.pxToRem(17),
    textShadow: "2px 2px 3px rgba(0,0,0,0.85)",
    "@media screen and (max-width:600px)": {
      fontSize: theme.typography.pxToRem(13),
    },
  },
  title: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    textAlign: "center",
    width: "100%",
    top: "40px",
    "@media screen and (max-width:960px)": {
      top: "20px",
      width: "calc(100% - 330px)",
      marginLeft: "330px",
    },
    "@media screen and (max-width:600px)": {
      position: "relative",
      width: "100%",
      right: "0",
      top: "0",
      marginLeft: "0",
    },
  },
  companyText: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "'Exo 2', sans-serif",
    fontSize: theme.typography.pxToRem(25),
    fontStyle: "italic",
    fontWeight: 600,
    textShadow: "4px 4px 6px rgba(0,0,0,0.45)",
    marginBottom: 0,
    "@media screen and (max-width:600px)": {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  icon: {
    color: "#FFF",
  },
}));
