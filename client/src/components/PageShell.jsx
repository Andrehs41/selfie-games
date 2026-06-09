import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Chip,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import QuizIcon from '@mui/icons-material/Quiz';
import CasinoIcon from '@mui/icons-material/Casino';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

export default function PageShell({ children, maxWidth = 'md' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Inicio', to: '/', icon: <HomeIcon /> },
    { label: 'La Trivia', to: '/trivia', icon: <QuizIcon /> },
    { label: 'La Ruleta', to: '/ruleta', icon: <CasinoIcon /> },
  ];
  if (user?.role === 'admin') {
    links.push({ label: 'Admin', to: '/admin', icon: <AdminPanelSettingsIcon /> });
  }

  const go = (to) => {
    navigate(to);
    setOpen(false);
  };
  const onLogout = () => {
    logout();
    navigate('/login');
  };
  const isActive = (to) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 253, 250, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'rgba(160,130,105,0.18)',
          color: 'text.primary',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1 }}>
            {isMobile && (
              <IconButton edge="start" onClick={() => setOpen(true)} aria-label="menú">
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              onClick={() => navigate('/')}
              sx={{ fontWeight: 700, letterSpacing: 0.5, cursor: 'pointer', flexGrow: { xs: 1, sm: 0 } }}
            >
              By Mariana Zapata
            </Typography>

            {/* Links desktop */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 0.5, ml: 3, flexGrow: 1 }}>
                {links.map((l) => (
                  <Button
                    key={l.to}
                    startIcon={l.icon}
                    onClick={() => go(l.to)}
                    sx={{
                      color: isActive(l.to) ? 'primary.contrastText' : 'text.secondary',
                      bgcolor: isActive(l.to) ? 'primary.main' : 'transparent',
                      '&:hover': { bgcolor: isActive(l.to) ? 'primary.main' : 'rgba(200,169,143,0.15)' },
                      px: 2,
                    }}
                  >
                    {l.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Usuario + salir (desktop) */}
            {!isMobile && user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', width: 34, height: 34, fontSize: 14 }}>
                  {initials(user.nombre)}
                </Avatar>
                <Box sx={{ lineHeight: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {user.nombre.split(' ')[0]}
                  </Typography>
                  {user.role === 'admin' && (
                    <Chip label="Admin" size="small" color="primary" sx={{ height: 16, fontSize: 10 }} />
                  )}
                </Box>
                <IconButton onClick={onLogout} aria-label="salir" title="Salir">
                  <LogoutIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer móvil */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation">
          {user && (
            <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
                {initials(user.nombre)}
              </Avatar>
              <Box>
                <Typography fontWeight={600}>{user.nombre}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.role === 'admin' ? 'Administrador' : 'Jugador'}
                </Typography>
              </Box>
            </Box>
          )}
          <Divider />
          <List>
            {links.map((l) => (
              <ListItemButton key={l.to} selected={isActive(l.to)} onClick={() => go(l.to)}>
                <ListItemIcon sx={{ minWidth: 40 }}>{l.icon}</ListItemIcon>
                <ListItemText primary={l.label} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <List>
            <ListItemButton onClick={onLogout}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Salir" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Container maxWidth={maxWidth} sx={{ py: { xs: 3, sm: 5 } }}>
        {children}
      </Container>
    </Box>
  );
}
