import { Box, Container, Link, Button } from '@mui/material';
import SkipNextIcon from '@mui/icons-material/SkipNext';

// Marco del kiosko: fondo de marca vívido + logo arriba, contenido centrado.
// Pensado para el tótem vertical (portrait) del stand.
// `onNext` (opcional): muestra el botón "Siguiente jugador" para reiniciar la
// sesión aunque el participante no termine los juegos (sus datos ya se guardaron).
export default function KioskShell({ children, maxWidth = 'sm', onNext, hideLogo = false }) {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(160deg, #FF3DA6 0%, #EC0E8E 52%, #F7941E 135%)',
      }}
    >
      {onNext && (
        <Button
          onClick={onNext}
          startIcon={<SkipNextIcon />}
          sx={{
            position: 'fixed',
            top: 14,
            right: 14,
            zIndex: 10,
            bgcolor: 'rgba(255,255,255,0.92)',
            color: 'primary.main',
            '&:hover': { bgcolor: '#fff' },
            boxShadow: 3,
          }}
        >
          Siguiente jugador
        </Button>
      )}

      {/* Logo sobre círculo blanco para que resalte en el fondo vívido */}
      {!hideLogo && (
        <Box
          sx={{
            mt: { xs: 4, sm: 6 },
            mb: 1,
            p: 1,
            bgcolor: '#fff',
            borderRadius: '50%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
            display: 'inline-flex',
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="By Mariana Zapata"
            sx={{ width: { xs: 120, sm: 150 }, display: 'block', userSelect: 'none' }}
          />
        </Box>
      )}

      <Container
        maxWidth={maxWidth}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 3 }}
      >
        {children}
      </Container>

      <Link
        href="/admin/login"
        underline="none"
        sx={{ position: 'fixed', bottom: 8, right: 12, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}
      >
        admin
      </Link>
    </Box>
  );
}
