import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "lightgray",
    boxShadow: "7px 7px 7px #777",
    cursor: "pointer",
    margin: "5px",
    padding: "10px",
    border: "solid 1px lightgray",
    borderRadius: "5px",
    maxWidth: "135px",
  },
  title: {
    display: "flex",
    justifyContent: "center",
    fontSize: "18px",
    fontFamily: "Russo One",
    margin: "10px 10px 0 10px",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  chipLeft: {
    marginRight: "10px",
  },
}));
