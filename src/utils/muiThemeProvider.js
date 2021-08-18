import { createTheme } from '@material-ui/core/styles'

const baseTheme = createTheme({
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 20
      }
    }
  }
})

const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    type: 'dark',
    primary: {
      main: '#90CAF9',
      navbar: '#FFF'
    },
    background: {
      table: '#333',
      navbar: '#333'
    }
  }
})

const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    type: 'light',
    primary: {
      main: '#1976d2',
      navbar: 'black'
    },
    background: {
      table: '#F5F5F5',
      navbar: '#239BB5'
    }
  }
})

export { darkTheme, lightTheme }