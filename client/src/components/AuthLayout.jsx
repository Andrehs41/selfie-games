import { useRef, useEffect } from 'react';
import { Box, Paper, Typography, Stack } from '@mui/material';
import { gsap } from 'gsap';

// Marco compartido para login/registro: fondo pastel + tarjeta animada con GSAP.
export default function AuthLayout({ title, subtitle, children }) {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
    );
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: 2,
        background:
          'radial-gradient(circle at 20% 20%, #F6E6DD 0%, transparent 55%),' +
          'radial-gradient(circle at 80% 80%, #EBD9CE 0%, transparent 55%),' +
          '#FBF4EC',
      }}
    >
      <Paper ref={cardRef} sx={{ p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 440 }}>
        <Stack spacing={1} sx={{ mb: 3, textAlign: 'center' }}>
          {/* Placeholder de logo (reemplazar cuando llegue la identidad del cliente) */}
          <Typography variant="overline" color="text.secondary" letterSpacing={3}>
            BY MARIANA ZAPATA
          </Typography>
          <Typography variant="h4">{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
        {children}
      </Paper>
    </Box>
  );
}
