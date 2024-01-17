import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()(theme => ({
  button: {
    padding: "5px 15px",
    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#08415c",
    color: "rgba(255,255,255,0.85)",
    boxShadow: "3px 3px 6px rgba(0,0,0,0.55)",
    "&:hover": {
      color: "#FFF",
      backgroundColor: theme.palette.mode === "dark" ? "#4d4949" : "#27546c",
      boxShadow: "4px 4px 6px rgba(0,0,0,0.55)",
    },
    "&:disabled": {
      color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.85)",
      backgroundColor: "#595959",
    },
  },
}));
