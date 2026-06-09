import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Stack,
  Chip,
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import CasinoIcon from '@mui/icons-material/Casino';
import { gsap } from 'gsap';
import PageShell from '../components/PageShell.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function GameCard({ icon, title, description, color, played, playedLabel, onClick, innerRef }) {
  return (
    <Card ref={innerRef} sx={{ height: '100%', bgcolor: color }}>
      <CardActionArea onClick={onClick} sx={{ height: '100%', p: 1 }}>
        <CardContent sx={{ textAlign: 'center', py: 5 }}>
          <Stack spacing={2} alignItems="center">
            {icon}
            <Typography variant="h4">{title}</Typography>
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
            {played ? (
              <Chip label={playedLabel} color="success" />
            ) : (
              <Chip label="¡Disponible!" variant="outlined" />
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out' }
    );
  }, []);

  const trivia = user?.games?.trivia;
  const ruleta = user?.games?.ruleta;

  return (
    <PageShell>
      <Stack spacing={1} sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3">Elige tu juego</Typography>
        <Typography variant="body1" color="text.secondary">
          Tienes una oportunidad en cada uno. ¡Mucha suerte!
        </Typography>
      </Stack>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <GameCard
            innerRef={(el) => (cardsRef.current[0] = el)}
            icon={<QuizIcon sx={{ fontSize: 64, color: 'primary.main' }} />}
            title="La Trivia"
            description="8 preguntas sobre By Mariana Zapata. ¿Cuántas aciertas?"
            color="rgba(232, 180, 184, 0.18)"
            played={trivia?.played}
            playedLabel={`Jugada · ${trivia?.score ?? 0}/${trivia?.total ?? 8}`}
            onClick={() => navigate('/trivia')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <GameCard
            innerRef={(el) => (cardsRef.current[1] = el)}
            icon={<CasinoIcon sx={{ fontSize: 64, color: 'secondary.main' }} />}
            title="La Ruleta"
            description="Gira y descubre si te llevas un premio sorpresa."
            color="rgba(200, 169, 143, 0.18)"
            played={ruleta?.played}
            playedLabel={ruleta?.prizeLabel ? `Resultado · ${ruleta.prizeLabel}` : 'Jugada'}
            onClick={() => navigate('/ruleta')}
          />
        </Grid>
      </Grid>
    </PageShell>
  );
}
