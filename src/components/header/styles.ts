import { makeStyles } from "tss-react/mui";
import LogoDarkImage from "assets/img/company-logo-dark.webp";

export const useStyles = makeStyles()((theme) => ({
  header: {
    backgroundImage: `linear-gradient(to bottom, ${
      theme.palette.mode === "dark"
        ? "rgba(51, 51, 51, 0.6)"
        : "rgba(8, 65, 92, 0.6)"
    }, ${
      theme.palette.mode === "dark"
        ? "rgba(51, 51, 51, 0.9)"
        : "rgba(8, 65, 92, 0.9)"
    }, ${
      theme.palette.mode === "dark"
        ? "rgba(51, 51, 51, 1)"
        : "rgba(8, 65, 92, 1)"
    })`,
    flex: "0 1 auto",
    paddingTop: "0",
    paddingBottom: "10px",
    "@media (max-width:960px)": {
      paddingBottom: "0",
    },
    "@media (max-width:600px)": {
      paddingBottom: "10px",
    },
  },
  banner: {
    backgroundImage: `url(${LogoDarkImage})`,
    backgroundRepeat: "no-repeat",
    position: "absolute",
    backgroundSize: "105px 105px",
    backgroundPosition: "10px 0",
    top: "10px",
    left: "0",
    height: "105px",
    width: "100%",
    "@media (max-width:600px)": {
      backgroundSize: "75px 75px",
      height: "75px",
    },
  },
  toogle: {
    position: "absolute",
    top: "89px",
    right: "52px",
    zIndex: 2,
    "@media (max-width:960px)": {
      top: "120px",
    },
    "@media (max-width:600px)": {
      top: "101px",
    },
  },
  logout: {
    position: "absolute",
    top: "89px",
    right: "8px",
    zIndex: 2,
    "@media (max-width:960px)": {
      top: "120px",
    },
    "@media (max-width:600px)": {
      top: "101px",
    },
  },
  text: {
    textAlign: "left",
    margin: "30px 0 40px 120px",
    "@media (max-width:960px)": {
      margin: "30px 0 0 120px",
    },
    "@media (max-width:600px)": {
      margin: "20px 0 10px 90px",
    },
  },
  h2: {
    color: theme.palette.mode === "dark" ? "#333" : "#08415c",
    fontFamily: "Russo One",
    fontStyle: "italic",
    fontSize: theme.typography.pxToRem(25),
    textShadow: "1px 1px 3px #FFF",
    "@media (max-width:600px)": {
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
    "@media (max-width:600px)": {
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
    "@media (max-width:960px)": {
      position: "relative",
      top: "0px",
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
    "@media (max-width:600px)": {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  icon: {
    color: "#FFF",
  },
}));
