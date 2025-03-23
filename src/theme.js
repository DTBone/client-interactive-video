import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,  
      sm: 600,  
      md: 900,  
      lg: 1200,  
      xl: 1536,  
    },
  },
  palette: {
    primary: {
      main: "#28a745",
    },
    secondary: {
      main: "#6c757d",
    },
    success: {
        main: "#28a745",
        },
    error: {
        main: "#dc3545",
    },
    warning: {
        main: "#ffc107",
    },
    info: {
        main: "#17a2b8",
    },
    grey: {
        main: "#5B5B5B",
    },

  },
  typography: {
    fontFamily: "Nunito, sans-serif",
    h1: { fontSize: "2.5rem", "@media (max-width:600px)": { fontSize: "2rem" } },
    h2: { fontSize: "2rem", "@media (max-width:600px)": { fontSize: "1.5rem" } },
    button: {
      textTransform: "none",
      fontWeight: "bold",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          padding: "10px 20px",
          fontSize: "1rem",
          boxShadow: "none !important",
        },
        containedPrimary: {
            backgroundColor: "primary",
            color: "white",
            "&:hover": {
                border: "1px solid #28a745 !important",
                backgroundColor: "white",
                color: "#dc3545",
            },
        },
        outlinedPrimary: {
          border: "2px solid primary",
          color: "primary",
        
          "&:hover": {
            backgroundColor: "#28a745",
            color: "white",
          },
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: "lg", // Kích thước mặc định là "lg"
      },
      styleOverrides: {
        root: {
          padding: "16px", // Thêm padding cho Container
        },
      },
    },
  },
});

export default theme;
