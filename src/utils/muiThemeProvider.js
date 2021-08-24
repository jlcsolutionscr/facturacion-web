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
      navbar: '#FFF',
      buttonText: 'rgba(255,255,255,0.85)',
      hoveredButtonText: '#FFF',
      disabledButtonText: 'rgba(255,255,255,0.65)'
    },
    background: {
      table: '#333',
      navbar: '#333',
      button: 'rgb(8, 65, 92)',
      hoveredButton: '#27546c',
      disabledButton: '#595959',
      branchPicker: '#595959'
    }
  }
})

const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    type: 'light',
    primary: {
      main: '#1976d2',
      navbar: 'black',
      buttonText: 'rgba(255,255,255,0.85)',
      hoveredButtonText: '#FFF',
      disabledButtonText: 'rgba(255,255,255,0.85)'
    },
    background: {
      table: '#F5F5F5',
      navbar: '#239BB5',
      button: 'rgb(8, 65, 92)',
      hoveredButton: '#27546c',
      disabledButton: '#595959',
      branchPicker: 'transparent'
    }
  }
})

export { darkTheme, lightTheme }