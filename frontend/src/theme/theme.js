import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#5F7161", // Sage green
      light: "#8DAA9D",
      dark: "#4A584C",
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#A7C4BC", // Light sage
      light: "#E4F0EC",
      dark: "#6A8C83",
      contrastText: "#ffffff"
    },
    background: {
      default: "#F4F9F4", // Very light sage
      paper: "#ffffff"
    },
    text: {
      primary: "#2F3E35", // Dark sage
      secondary: "#5E6D64" // Medium sage
    },
    error: {
      main: "#D27D73"
    },
    success: {
      main: "#73937E"
    },
    warning: {
      main: "#D4B88E"
    }
  },
  shape: {
    borderRadius: 8
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: "Playfair Display, serif",
    h1: {
      fontSize: "4.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      "@media (max-width:960px)": {
        fontSize: "3.5rem",
      },
      "@media (max-width:600px)": {
        fontSize: "2.5rem",
      },
    },
    h2: {
      fontSize: "3.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      "@media (max-width:960px)": {
        fontSize: "2.75rem",
      },
      "@media (max-width:600px)": {
        fontSize: "2.25rem",
      },
    },
    h3: {
      fontSize: "2.5rem",
      fontWeight: 600,
      lineHeight: 1.3,
      "@media (max-width:960px)": {
        fontSize: "2rem",
      },
      "@media (max-width:600px)": {
        fontSize: "1.75rem",
      },
    },
    h4: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
      "@media (max-width:960px)": {
        fontSize: "1.75rem",
      },
      "@media (max-width:600px)": {
        fontSize: "1.5rem",
      },
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
      "@media (max-width:960px)": {
        fontSize: "1.25rem",
      },
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
      "@media (max-width:960px)": {
        fontSize: "1.1rem",
      },
    },
    body1: {
      fontFamily: "Inter, sans-serif",
      fontSize: "1rem",
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontFamily: "Inter, sans-serif",
      fontSize: "0.875rem",
      lineHeight: 1.6,
      fontWeight: 400,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontFamily: "Inter, sans-serif",
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 6px -1px rgba(95, 113, 97, 0.2), 0 2px 4px -1px rgba(95, 113, 97, 0.1)",
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 1px 3px 0 rgba(95, 113, 97, 0.1), 0 1px 2px 0 rgba(95, 113, 97, 0.06)",
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(95, 113, 97, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(95, 113, 97, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5F7161',
            },
          },
        },
      },
    },
  }
});

export default theme;