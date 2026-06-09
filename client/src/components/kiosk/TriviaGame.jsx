import { useEffect, useRef, useState } from 'react';
import { Paper, Typography, Stack, Button, LinearProgress, Box, CircularProgress } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { gsap } from 'gsap';
import api from '../../api/client.js';
import { celebrate } from '../../utils/confetti.js';

export default function TriviaGame({ participant, onDone }) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const questionRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    api
      .get('/play/trivia')
      .then((res) => setQuestions(res.data.questions))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (questionRef.current) {
      gsap.fromTo(questionRef.current, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
    }
  }, [current, loading]);

  useEffect(() => {
    if (result && resultRef.current) {
      gsap.fromTo(resultRef.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' });
      if (result.score === result.total) celebrate();
    }
  }, [result]);

  const select = (qid, optId) => {
    const next = { ...answers, [qid]: optId };
    setAnswers(next);
    if (current < questions.length - 1) setCurrent((c) => c + 1);
    else submit(next);
  };

  const submit = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const res = await api.post(`/play/${participant.id}/trivia`, { answers: finalAnswers });
      setResult({ score: res.data.score, total: res.data.total });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (result) {
    return (
      <Paper ref={resultRef} sx={{ p: 5, textAlign: 'center' }}>
        <Stack spacing={2} alignItems="center">
          <EmojiEventsIcon sx={{ fontSize: 72, color: 'secondary.main' }} />
          <Typography variant="h4">¡Trivia completada!</Typography>
          <Typography variant="h2" color="primary.main">
            {result.score}/{result.total}
          </Typography>
          <Typography color="text.secondary">
            {result.score === result.total ? '¡Perfecto! Conoces la marca 💖' : '¡Bien hecho!'}
          </Typography>
          <Button variant="contained" size="large" onClick={() => onDone(result)} sx={{ py: 1.6, px: 5, fontSize: 18 }}>
            Continuar
          </Button>
        </Stack>
      </Paper>
    );
  }

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Pregunta {current + 1} de {questions.length}
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 99, height: 10 }} />
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
              sx={{ justifyContent: 'flex-start', borderRadius: 3, py: 1.6, textAlign: 'left', fontSize: 17, borderColor: 'divider' }}
            >
              {opt.text}
            </Button>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
