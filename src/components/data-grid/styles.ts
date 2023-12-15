import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => ({
  root: {
    width: "100%",
    display: "flex",
  },
  paper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#333",
  },
  tableContainer: {
    flex: "1 1 auto",
    color: "white",
  },
  pagination: {
    flex: "1 0 auto",
  },
  paginationActions: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));
