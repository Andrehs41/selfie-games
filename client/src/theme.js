import { createTheme } from '@mui/material/styles';

// Paleta PROVISIONAL pastel / beige para Expobelleza.
// Cuando el cliente entregue su identidad, basta con cambiar estos valores.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#C8A98F', contrastText: '#3B2F2A' }, // beige tostado
    secondary: { main: '#E8B4B8', contrastText: '#3B2F2A' }, // rosa pastel
    success: { main: '#A8C3A2' }, // verde salvia suave
    background: {
      default: '#FBF4EC', // crema
      paper: '#FFFDFA',
    },
    text: {
      primary: '#4A3F38',
      secondary: '#8C7A6E',
    },
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: '"Poppins", "Segoe UI", sans-serif',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 28, paddingBlock: 10 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { boxShadow: '0 12px 40px rgba(160, 130, 105, 0.15)' },
      },
    },
  },
});

export default theme;
