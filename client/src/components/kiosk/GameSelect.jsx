import { useEffect, useRef } from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography, Stack, Chip, Box } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import CasinoIcon from '@mui/icons-material/Casino';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { gsap } from 'gsap';

function GameCard({ icon, title, description, accent, done, onClick, innerRef }) {
  return (
    <Card
      ref={innerRef}
      sx={{ height: '100%', bgcolor: 'background.paper', borderTop: `7px solid ${accent}`, opacity: done ? 0.9 : 1 }}
    >
      <CardActionArea onClick={done ? undefined : onClick} disabled={done} sx={{ height: '100%', p: 1 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Stack spacing={1.5} alignItems="center">
            <Box sx={{ bgcolor: `${accent}1F`, borderRadius: '50%', p: 1.6, display: 'inline-flex' }}>{icon}</Box>
            <Typography variant="h4">{title}</Typography>
            <Typography color="text.secondary">{description}</Typography>
            {done ? (
              <Chip icon={<CheckCircleIcon />} label="¡Completado!" color="success" />
            ) : (
              <Chip label="Toca para jugar" color="primary" />
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
        <Typography variant="h3" sx={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          ¡Hola, {participant?.nombre?.split(' ')[0]}!
        </Typography>
        <Typography sx={{ fontSize: 18, color: 'rgba(255,255,255,0.95)' }}>
          Juega los dos para terminar. Elige uno:
        </Typography>
      </Stack>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <GameCard
            innerRef={(el) => (cardsRef.current[0] = el)}
            icon={<QuizIcon sx={{ fontSize: 60, color: 'primary.main' }} />}
            title="La Trivia"
            description="8 preguntas sobre la marca"
            accent="#EC0E8E"
            done={done.trivia}
            onClick={() => onPick('trivia')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <GameCard
            innerRef={(el) => (cardsRef.current[1] = el)}
            icon={<CasinoIcon sx={{ fontSize: 60, color: 'secondary.main' }} />}
            title="La Ruleta"
            description="Gira y gana premios"
            accent="#F7941E"
            done={done.ruleta}
            onClick={() => onPick('ruleta')}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
