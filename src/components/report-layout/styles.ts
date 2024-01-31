import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()(theme => ({
  container: {
    overflow: "auto",
  },
  title: {
    color: theme.palette.text.primary,
    textAlign: "center",
    fontSize: theme.typography.pxToRem(20),
    marginBottom: "12px",
  },
  subTitle: {
    color: theme.palette.text.primary,
    textAlign: "center",
    fontSize: theme.typography.pxToRem(15),
    marginBottom: "8px",
  },
  headerRange: {
    display: "flex",
    flexDirection: "row",
  },
}));
