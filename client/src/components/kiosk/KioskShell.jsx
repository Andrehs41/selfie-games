import { Box, Container, Link } from '@mui/material';

// Marco del kiosko: fondo de marca + logo arriba, contenido centrado.
// Pensado para el tótem vertical (portrait) del stand.
export default function KioskShell({ children, maxWidth = 'sm' }) {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background:
          'radial-gradient(circle at 50% 0%, rgba(236,14,142,0.10) 0%, transparent 45%),' +
          'radial-gradient(circle at 50% 100%, rgba(247,148,30,0.10) 0%, transparent 45%),' +
          '#FAF3E6',
      }}
    >
      <Box
        component="img"
        src="/logo.png"
        alt="By Mariana Zapata"
        sx={{ width: { xs: 130, sm: 170 }, mt: { xs: 4, sm: 6 }, mb: 1, userSelect: 'none' }}
      />
      <Container
        maxWidth={maxWidth}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 3 }}
      >
        {children}
      </Container>

      {/* Acceso discreto para el staff */}
      <Link
        href="/admin/login"
        underline="none"
        sx={{ position: 'fixed', bottom: 8, right: 12, fontSize: 12, color: 'text.secondary', opacity: 0.45 }}
      >
        admin
      </Link>
    </Box>
  );
}
