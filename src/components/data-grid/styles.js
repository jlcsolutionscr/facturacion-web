import { makeStyles, createStyles } from "@material-ui/core/styles";

export const createStyle = makeStyles(theme =>
  createStyles({
    root: {
      width: "100%",
      display: "flex",
    },
    paper: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.palette.background.table,
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
  })
);
