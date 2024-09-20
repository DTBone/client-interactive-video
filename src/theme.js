// import { createTheme } from '@mui/material/styles'
import { cyan, deepOrange, orange, teal } from '@mui/material/colors'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

// Create a theme instance.
const theme = extendTheme({
  palette: {
    mode: 'light',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: teal[900]
        },
        secondary: {
          main: deepOrange[500]
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: cyan[500]
        },
        secondary: {
          main: orange[500]
        }
      }
    }
  }
})


export default theme