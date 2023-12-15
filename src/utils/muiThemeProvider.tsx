declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      pagesBackground: string;
      navbarBackground: string;
      borderColor: string;
    };
  }

  interface PaletteOptions {
    custom: {
      pagesBackground: string;
      navbarBackground: string;
      borderColor: string;
    };
  }
}

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
    custom: {
      pagesBackground: "#424242",
      navbarBackground: "#333",
      borderColor: "rgba(255, 255, 255, 0.23)",
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
    custom: {
      pagesBackground: "#F2F2F2",
      navbarBackground: "#08415c",
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
  },
});

export { darkTheme, lightTheme };
