import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()(() => ({
  container: {
    display: "flex",
    backgroundColor: "rgb(8, 65, 96)",
    color: "#CCC",
    boxShadow: "6px 6px 6px #777",
    cursor: "pointer",
    margin: "10px",
    padding: "7px",
    border: "solid 1px lightgray",
    borderRadius: "5px",
    width: "140px",
    height: "50px",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    display: "flex",
    fontSize: "18px",
    fontFamily: "Russo One",
    margin: "5px",
    maxHeight: "20px",
    overflow: "hidden",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  chipLeft: {
    marginRight: "10px",
  },
}));
