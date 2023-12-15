import React from "react";
import { makeStyles } from "tss-react/mui";
import { useDispatch, useSelector } from "react-redux";

import { ThemeProvider } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import SnackbarContent from "@mui/material/SnackbarContent";

import { setMessage, getMessage } from "state/ui/reducer";
import { RootState } from "state/store";

import Loader from "components/loader";
import useWindowSize from "hooks/use-window-size";
import LoginPage from "pages/login-page";
import HomePage from "pages/home-page";

import { darkTheme, lightTheme } from "utils/muiThemeProvider";
import { ErrorIcon, InfoIcon } from "utils/iconsHelper";

const useStyles = makeStyles()((theme) => ({
  container: {
    display: "flex",
  },
  snackbarMessage: {
    width: "100%",
  },
  snackbarError: {
    backgroundColor: theme.palette.mode === "dark" ? "#b23c17" : "#ab003c",
  },
  snackbarInfo: {
    backgroundColor: theme.palette.mode === "dark" ? "#2196f3" : "#1c54b2",
  },
  message: {
    color: "#FFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    width: "32px",
    height: "32px",
    opacity: 0.9,
  },
}));

function RoutingPage() {
  const dispatch = useDispatch();
  const size = useWindowSize();
  const authenticated = useSelector(
    (state: RootState) => state.session.authenticated
  );
  const { message, messageType } = useSelector(getMessage);

  const [isDarkMode, setDarkMode] = React.useState(false);
  const { classes } = useStyles();
  const width = size.width > 320 ? size.width : 320;
  const component = !authenticated ? (
    <LoginPage
      width={width}
      isDarkMode={isDarkMode}
      toggleDarkMode={() => setDarkMode((prev) => ![prev])}
    />
  ) : (
    <HomePage
      width={width}
      isDarkMode={isDarkMode}
      toggleDarkMode={() => setDarkMode((prev) => !prev)}
    />
  );
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <div
        id="main_container"
        className={classes.container}
        style={{ height: `${size.height}px`, width: `${size.width}px` }}
      >
        <Loader />
        {component}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          TransitionComponent={Slide}
          autoHideDuration={6000}
          open={message !== ""}
          onClose={() =>
            dispatch(setMessage({ message: "", type: messageType }))
          }
        >
          <SnackbarContent
            classes={{
              root:
                messageType === "ERROR"
                  ? classes.snackbarError
                  : classes.snackbarInfo,
              message: classes.snackbarMessage,
            }}
            message={
              <div className={classes.message} id="client-snackbar">
                <span>{message}</span>
                {messageType === "ERROR" ? (
                  <ErrorIcon className={classes.icon} />
                ) : (
                  <InfoIcon className={classes.icon} />
                )}
              </div>
            }
          />
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default RoutingPage;
