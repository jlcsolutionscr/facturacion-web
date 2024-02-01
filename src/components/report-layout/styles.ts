import { makeStyles } from "tss-react/mui";

import { TRANSITION_ANIMATION } from "utils/constants";

export const useStyles = makeStyles()(theme => ({
  container: {
    overflow: "auto",
  },
  title: {
    color: theme.palette.text.primary,
    textAlign: "center",
    fontSize: theme.typography.pxToRem(20),
    marginBottom: "12px",
    transition: `color ${TRANSITION_ANIMATION}`,
  },
  subTitle: {
    color: theme.palette.text.primary,
    textAlign: "center",
    fontSize: theme.typography.pxToRem(15),
    marginBottom: "8px",
    transition: `color ${TRANSITION_ANIMATION}`,
  },
  headerRange: {
    display: "flex",
    flexDirection: "row",
  },
}));
