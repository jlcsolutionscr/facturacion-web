import { makeStyles, createStyles } from "@material-ui/core/styles";

export const createStyle = makeStyles(theme =>
  createStyles({
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
      fontFamily: "RussoOne",
      margin: "10px 10px 0 10px",
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
    },
    chipLeft: {
      marginRight: "10px",
    },
  })
);
