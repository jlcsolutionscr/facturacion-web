import React from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import Menu from './menu/menu'

const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      outlined: {
        borderRadius: 2
      }
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div style={{minWidth: `${window.innerWidth / 8 * 7}px`}} >
        <Menu />
      </div>
    </ThemeProvider>
  );
}

export default App;
