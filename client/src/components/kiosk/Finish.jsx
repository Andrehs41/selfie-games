import { useEffect, useRef } from 'react';
import { Paper, Typography, Stack, Button, Chip, Box } from '@mui/material';
import { gsap } from 'gsap';
import { celebrate } from '../../utils/confetti.js';

const AUTO_RESET_MS = 30000; // vuelve al inicio solo, por si nadie pulsa

// Pantalla final: resumen + botón para el siguiente jugador.
export default function Finish({ participant, results, onReset }) {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(ref.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' });
    if (results.ruleta?.prizeType === 'win') celebrate();
    const t = setTimeout(onReset, AUTO_RESET_MS);
    return () => clearTimeout(t);
  }, []);

  const won = results.ruleta?.prizeType === 'win';

  return (
    <Paper ref={ref} sx={{ p: { xs: 4, sm: 5 }, textAlign: 'center' }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h3" color="primary.main">
          ¡Gracias por jugar{participant?.nombre ? `, ${participant.nombre.split(' ')[0]}` : ''}!
        </Typography>

        <Box>
          <Typography color="text.secondary">Trivia</Typography>
          <Typography variant="h4">
            {results.trivia ? `${results.trivia.score}/${results.trivia.total}` : '—'}
          </Typography>
        </Box>

        <Box>
          <Typography color="text.secondary">Ruleta</Typography>
          {won ? (
            <Chip label={`🎉 ${results.ruleta.prizeLabel}`} color="secondary" sx={{ fontSize: 18, py: 2.5, px: 1.5, mt: 0.5 }} />
          ) : (
            <Typography variant="h5">¡Sigue intentando! 💖</Typography>
          )}
        </Box>

        {won && (
          <Typography variant="body2" color="text.secondary">
            Acércate al stand para reclamar tu premio.
          </Typography>
        )}

        <Button variant="contained" size="large" onClick={onReset} sx={{ mt: 2, py: 1.8, px: 6, fontSize: 20 }}>
          Siguiente jugador →
        </Button>
      </Stack>
    </Paper>
  );
}
