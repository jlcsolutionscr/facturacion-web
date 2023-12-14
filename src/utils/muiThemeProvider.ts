import { ThemeOptions, createTheme } from "@mui/material/styles";

const baseTheme: ThemeOptions = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
  },
});

const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    mode: "dark",
    primary: {
      main: "#90CAF9",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      paper: "#FFF",
    },
  },
});

const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      paper: "#FFF",
    },
  },
});

export { darkTheme, lightTheme };
