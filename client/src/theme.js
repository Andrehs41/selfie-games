import { createTheme } from '@mui/material/styles';

// Paleta de marca By Mariana Zapata (extraída del logo + piezas de Expobelleza):
// fucsia/magenta vívido, coral/naranja, rosa del logo, crema y texto marrón.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#EC0E8E', contrastText: '#FFFFFF' }, // fucsia/magenta marca
    secondary: { main: '#F7941E', contrastText: '#FFFFFF' }, // coral / naranja
    success: { main: '#7FB77E' },
    info: { main: '#29ABE2' }, // azul "Pabellón Azul" (acento puntual)
    background: {
      default: '#FAF3E6', // crema
      paper: '#FFFDFA',
    },
    text: {
      primary: '#3B2F2A',
      secondary: '#8C7A6E',
    },
  },
  shape: { borderRadius: 20 },
  typography: {
    fontFamily: '"Poppins", "Segoe UI", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 30, paddingBlock: 12 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { boxShadow: '0 14px 44px rgba(236, 14, 142, 0.12)' },
      },
    },
  },
});

// Rosa del logo, útil para fondos/acentos suaves.
export const LOGO_PINK = '#E87CB2';

export default theme;
