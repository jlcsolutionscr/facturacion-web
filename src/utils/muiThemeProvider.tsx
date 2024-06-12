import { createTheme, ThemeOptions } from "@mui/material/styles";

const baseTheme: ThemeOptions = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#FFF",
          "&.Mui-selected": {
            color: "#90CAF9",
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: "standard",
      },
    },
  },
});

const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark",
    primary: {
      main: "#90CAF9",
    },
    secondary: {
      main: "#F50057",
    },
    background: {
      paper: "hsl(210, 14%, 7%)",
    },
  },
});

const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    mode: "light",
    primary: {
      main: "#1976D2",
    },
    secondary: {
      main: "#F50057",
    },
    background: {
      paper: "#FFF",
    },
  },
});

export { darkTheme, lightTheme };
