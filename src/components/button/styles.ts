import { makeStyles } from "tss-react/mui";

import { TRANSITION_ANIMATION } from "utils/constants";

export const useStyles = makeStyles()(theme => ({
  button: {
    padding: "5px 15px",
    backgroundColor: theme.palette.mode === "dark" ? "rgb(144, 202, 249)" : "#08415c",
    color: theme.palette.mode === "dark" ? "#000" : "rgba(255,255,255,0.85)",
    boxShadow: "3px 3px 6px rgba(0,0,0,0.55)",
    transition: `background-color ${TRANSITION_ANIMATION}, color ${TRANSITION_ANIMATION}`,
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "rgb(66, 165, 245)" : "#27546c",
      boxShadow: "4px 4px 6px rgba(0,0,0,0.55)",
    },
    "&:disabled": {
      backgroundColor: theme.palette.mode === "dark" ? "rgb(144, 202, 249)" : "#08415c",
      color: theme.palette.mode === "dark" ? "#000" : "rgba(255,255,255,0.85)",
      opacity: theme.palette.mode === "dark" ? 0.5 : 0.7,
    },
  },
}));
