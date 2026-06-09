import { useEffect, useRef } from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography, Stack, Chip, Box } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import CasinoIcon from '@mui/icons-material/Casino';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { gsap } from 'gsap';

function GameCard({ icon, title, description, color, done, onClick, innerRef }) {
  return (
    <Card ref={innerRef} sx={{ height: '100%', bgcolor: color, opacity: done ? 0.7 : 1 }}>
      <CardActionArea onClick={done ? undefined : onClick} disabled={done} sx={{ height: '100%', p: 1 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Stack spacing={1.5} alignItems="center">
            {icon}
            <Typography variant="h4">{title}</Typography>
            <Typography color="text.secondary">{description}</Typography>
            {done ? (
              <Chip icon={<CheckCircleIcon />} label="¡Completado!" color="success" />
            ) : (
              <Chip label="Toca para jugar" color="primary" variant="outlined" />
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

// Pantalla de selección: el participante debe jugar AMBOS juegos.
export default function GameSelect({ participant, done, onPick }) {
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power3.out' }
    );
  }, []);

  return (
    <Box>
      <Stack spacing={1} sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3">
          ¡Hola, {participant?.nombre?.split(' ')[0]}!
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 18 }}>
          Juega los dos para terminar. Elige uno:
        </Typography>
      </Stack>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <GameCard
            innerRef={(el) => (cardsRef.current[0] = el)}
            icon={<QuizIcon sx={{ fontSize: 64, color: 'primary.main' }} />}
            title="La Trivia"
            description="8 preguntas sobre la marca"
            color="rgba(236,14,142,0.08)"
            done={done.trivia}
            onClick={() => onPick('trivia')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <GameCard
            innerRef={(el) => (cardsRef.current[1] = el)}
            icon={<CasinoIcon sx={{ fontSize: 64, color: 'secondary.main' }} />}
            title="La Ruleta"
            description="Gira y gana premios"
            color="rgba(247,148,30,0.10)"
            done={done.ruleta}
            onClick={() => onPick('ruleta')}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
