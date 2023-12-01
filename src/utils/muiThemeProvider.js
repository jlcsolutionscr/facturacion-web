import { createTheme } from "@material-ui/core/styles";

const baseTheme = createTheme({
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 20,
      },
    },
  },
});

const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    type: "dark",
    primary: {
      main: "#90CAF9",
      navbar: "#FFF",
      buttonText: "rgba(255,255,255,0.85)",
      hoveredButtonText: "#FFF",
      disabledButtonText: "rgba(255,255,255,0.65)",
      border: "rgba(255, 255, 255, 0.23)",
    },
    background: {
      pages: "#424242",
      table: "#333",
      navbar: "#333",
      button: "#333",
      hoveredButton: "#4d4949",
      disabledButton: "#595959",
      branchPicker: "rgba(51, 51, 51, 0.9)",
      headerMin: "rgba(51, 51, 51, 0.6)",
      headerMiddle: "rgba(51, 51, 51, 0.9)",
      headerMax: "rgba(51, 51, 51, 1)",
    },
  },
});

const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    type: "light",
    primary: {
      main: "#1976d2",
      navbar: "#FFF",
      buttonText: "rgba(255,255,255,0.85)",
      hoveredButtonText: "#FFF",
      disabledButtonText: "rgba(255,255,255,0.85)",
      border: "rgba(0, 0, 0, 0.23)",
    },
    background: {
      pages: "#F2F2F2",
      table: "#F5F5F5",
      navbar: "#08415c",
      button: "#08415c",
      hoveredButton: "#27546c",
      disabledButton: "#595959",
      branchPicker: "transparent",
      headerMin: "rgba(8, 65, 92, 0.6)",
      headerMiddle: "rgba(8, 65, 92, 0.9)",
      headerMax: "rgba(8, 65, 92, 1)",
    },
  },
});

export { darkTheme, lightTheme };
