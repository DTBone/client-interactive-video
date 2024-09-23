import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#0048b0',
          light: '#3373c4',
          dark: '#00349d',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#f0f6ff',
          light: '#ffffff',
          dark: '#c2d6f5',
          contrastText: '#0048b0',
        },
        background: {
          default: '#ffffff',
          paper: '#f7f9fc',
        },
        text: {
          primary: '#1a2027',
          secondary: '#3a4550',
        },
        action: {
          hover: '#f0f6ff',
          active: '#f2f5fa',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#3373c4',
          light: '#5e90d6',
          dark: '#0048b0',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#1e2a3a',
          light: '#2c3e50',
          dark: '#0f1721',
          contrastText: '#ffffff',
        },
        background: {
          default: '#0a1929',
          paper: '#101f33',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b0bec5',
        },
        action: {
          hover: '#1e2a3a',
          active: '#2c3e50',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#f0f6ff',
          },
          '&:active': {
            backgroundColor: '#f2f5fa',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#0048b0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0048b0',
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#0048b0',
          '&.Mui-checked': {
            color: '#0048b0',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#0048b0',
          '&.Mui-checked': {
            color: '#0048b0',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: '#0048b0',
            '& + .MuiSwitch-track': {
              backgroundColor: '#0048b0',
            },
          },
        },
      },
    },
  },
});

export default theme;

// // import { createTheme } from '@mui/material/styles'
// import { blue, cyan, orange } from '@mui/material/colors'
// import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

// // Create a theme instance.
// const theme = extendTheme({
//   palette: {
//     mode: 'light',
//   },
//   colorSchemes: {
//     light: {
//       palette: {
//         primary: {
//           main: "#0048b0"
//         },
//         secondary: {
//           main: blue[500]
//         }
//       }
//     },
//     dark: {
//       palette: {
//         primary: {
//           main: cyan[500]
//         },
//         secondary: {
//           main: orange[500]
//         }
//       }
//     }
//   }
// })


// export default theme


