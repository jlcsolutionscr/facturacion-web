import React from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import Menu from './menu'

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
      <div style={{minWidth: `${window.innerWidth / 4 * 3}px`}} >
        <Menu />
      </div>
    </ThemeProvider>
  );
}

export default App;
