import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()(theme => ({
  root: {
    width: "100%",
    display: "flex",
  },
  paper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.mode === "dark" ? "#333" : "rgba(255, 255, 255, .87)",
  },
  tableContainer: {
    flex: "1 1 auto",
    color: theme.palette.mode === "dark" ? "#FFF" : "#333",
  },
  pagination: {
    flex: "1 0 auto",
  },
  paginationActions: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));
