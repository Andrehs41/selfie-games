import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Stack,
  Button,
  LinearProgress,
  Box,
  CircularProgress,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { gsap } from 'gsap';
import PageShell from '../components/PageShell.jsx';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { celebrate } from '../utils/confetti.js';

export default function Trivia() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null); // { score, total }
  const [submitting, setSubmitting] = useState(false);
  const questionRef = useRef(null);
  const resultRef = useRef(null);

  // Carga inicial: preguntas o resultado previo si ya jugó.
  useEffect(() => {
    api
      .get('/games/trivia')
      .then((res) => {
        if (res.data.played) {
          setResult({ score: res.data.result.score, total: res.data.result.total });
        } else {
          setQuestions(res.data.questions);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Anima la entrada de cada pregunta.
  useEffect(() => {
    if (questionRef.current) {
      gsap.fromTo(
        questionRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [current, loading]);

  // Anima la tarjeta de resultado + confeti si fue perfecto.
  useEffect(() => {
    if (result && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
      );
      if (result.score === result.total) celebrate();
    }
  }, [result]);

  const select = (questionId, optionIndex) => {
    const next = { ...answers, [questionId]: optionIndex };
    setAnswers(next);
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      submit(next);
    }
  };

  const submit = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const res = await api.post('/games/trivia', { answers: finalAnswers });
      setResult({ score: res.data.score, total: res.data.total });
      await refreshUser();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageShell maxWidth="sm">
        <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </PageShell>
    );
  }

  if (result) {
    return (
      <PageShell maxWidth="sm">
        <Paper ref={resultRef} sx={{ p: 5, textAlign: 'center' }}>
          <Stack spacing={2} alignItems="center">
            <EmojiEventsIcon sx={{ fontSize: 72, color: 'secondary.main' }} />
            <Typography variant="h4">¡Trivia completada!</Typography>
            <Typography variant="h2" color="primary.main">
              {result.score}/{result.total}
            </Typography>
            <Typography color="text.secondary">
              {result.score === result.total
                ? '¡Perfecto! Conoces muy bien la marca 💖'
                : '¡Gracias por participar!'}
            </Typography>
            <Button variant="contained" onClick={() => navigate('/')}>
              Volver al inicio
            </Button>
          </Stack>
        </Paper>
      </PageShell>
    );
  }

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  return (
    <PageShell maxWidth="sm">
      <Stack spacing={3}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Pregunta {current + 1} de {questions.length}
          </Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 99, height: 8 }} />
        </Box>

        <Paper ref={questionRef} sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            {q.question}
          </Typography>
          <Stack spacing={1.5}>
            {q.options.map((opt) => (
              <Button
                key={opt.id}
                variant="outlined"
                size="large"
                disabled={submitting}
                onClick={() => select(q.id, opt.id)}
                sx={{
                  justifyContent: 'flex-start',
                  borderRadius: 3,
                  py: 1.5,
                  textAlign: 'left',
                  borderColor: 'divider',
                }}
              >
                {opt.text}
              </Button>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </PageShell>
  );
}
