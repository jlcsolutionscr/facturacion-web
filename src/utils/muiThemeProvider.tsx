declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      pagesBackground: string;
      navbarBackground: string;
      borderColor: string;
      backgroundHeaderMin: string;
      backgroundHeaderMiddle: string;
      backgroundHeaderMax: string;
    };
  }

  interface PaletteOptions {
    custom: {
      pagesBackground: string;
      navbarBackground: string;
      borderColor: string;
      backgroundHeaderMin: string;
      backgroundHeaderMiddle: string;
      backgroundHeaderMax: string;
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
      backgroundHeaderMin: "rgba(51, 51, 51, 0.6)",
      backgroundHeaderMiddle: "rgba(51, 51, 51, 0.9)",
      backgroundHeaderMax: "rgba(51, 51, 51, 1)",
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
      backgroundHeaderMin: "rgba(8, 65, 92, 0.6)",
      backgroundHeaderMiddle: "rgba(8, 65, 92, 0.9)",
      backgroundHeaderMax: "rgba(8, 65, 92, 1)",
    },
  },
});

export { darkTheme, lightTheme };
