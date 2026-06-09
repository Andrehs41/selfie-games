import { AppBar, Toolbar, Box, Container, Button, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Shell del panel de administración.
export default function PageShell({ children, maxWidth = 'lg' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const onLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,253,250,0.85)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(236,14,142,0.15)',
          color: 'text.primary',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            <Box component="img" src="/logo.png" alt="By Mariana Zapata" sx={{ height: 40 }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              Admin
            </Typography>
            {user && (
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
                {user.nombre || user.email}
              </Typography>
            )}
            <Button startIcon={<LogoutIcon />} onClick={onLogout} color="inherit">
              Salir
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth={maxWidth} sx={{ py: { xs: 3, sm: 5 } }}>
        {children}
      </Container>
    </Box>
  );
}
