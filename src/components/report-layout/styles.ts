import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()(theme => ({
  container: {
    overflow: "auto",
    margin: "0 auto",
  },
  title: {
    color: theme.palette.text.primary,
    textAlign: "center",
    fontSize: theme.typography.pxToRem(20),
    marginBottom: "20px",
  },
  subTitle: {
    color: theme.palette.text.primary,
    textAlign: "center",
    fontSize: theme.typography.pxToRem(15),
    marginBottom: "20px",
  },
  headerRange: {
    display: "flex",
    flexDirection: "row",
  },
}));
