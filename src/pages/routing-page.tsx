import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
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

function RoutingPage() {
  const dispatch = useDispatch();
  const size = useWindowSize();
  const authenticated = useSelector(
    (state: RootState) => state.session.authenticated
  );
  const { message, messageType } = useSelector(getMessage);

  const [isDarkMode, setDarkMode] = React.useState(false);
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
      <Box
        id="main_container"
        sx={{ display: "flex" }}
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
            sx={{
              bgColor: isDarkMode ? "#b23c17" : "#ab003c",
              width: "100%",
            }}
            message={
              <Box
                sx={{
                  color: "#FFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                id="client-snackbar"
              >
                <span>{message}</span>
                {messageType === "ERROR" ? (
                  <ErrorIcon
                    sx={{ width: "32px", height: "32px", opacity: 0.9 }}
                  />
                ) : (
                  <InfoIcon
                    sx={{ width: "32px", height: "32px", opacity: 0.9 }}
                  />
                )}
              </Box>
            }
          />
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default RoutingPage;
