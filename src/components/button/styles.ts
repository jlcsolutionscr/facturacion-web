import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()(() => ({
  button: {
    padding: "5px 15px",
    backgroundColor: "#333",
    color: "rgba(255,255,255,0.85)",
    boxShadow: "3px 3px 6px rgba(0,0,0,0.55)",
    "&:hover": {
      color: "#FFF",
      backgroundColor: "#4d4949",
      boxShadow: "4px 4px 6px rgba(0,0,0,0.55)",
    },
    "&:disabled": {
      color: "rgba(255,255,255,0.65)",
      backgroundColor: "#595959",
    },
  },
}));
