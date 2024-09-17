import { cyan, deepOrange, orange, teal } from '@mui/material/colors';
import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Create a theme instance.
const theme = extendTheme({
    componentSize: {
        appBarHeight: '48px',
        boardBarHeight: '58px',
    },
    fontFamily: 'Roboto, sans-serif',
    colorSchemes: {
        light: {
            palette: {
                primary: teal,
                secondary: deepOrange,

            },
            //spacing: (factor) => `${0.25 * factor}rem`
        },
        dark: {
            palette: {
                primary: cyan,
                secondary: orange,
            },
            //spacing: (factor) => `${0.25 * factor}rem`
        }
    }
    // ...other properties
})

export default theme;