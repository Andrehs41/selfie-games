import { useRef, useEffect, useState } from 'react';
import { Paper, Typography, Stack, TextField, Button, Alert } from '@mui/material';
import { gsap } from 'gsap';
import api from '../../api/client.js';

// Formulario inicial del kiosko: solo Nombre y Apellido + Teléfono.
export default function StartForm({ onStarted }) {
  const [form, setForm] = useState({ nombre: '', telefono: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/play', form);
      onStarted(res.data.participant);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper ref={cardRef} sx={{ p: { xs: 3, sm: 5 } }}>
      <Stack spacing={1} sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h3" color="primary.main">
          ¡Juega y gana!
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 18 }}>
          Ingresa tus datos para participar en La Trivia y La Ruleta
        </Typography>
      </Stack>
      <form onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Nombre y Apellido"
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            required
            fullWidth
            autoFocus
            inputProps={{ style: { fontSize: 20 } }}
          />
          <TextField
            label="Número de teléfono"
            name="telefono"
            value={form.telefono}
            onChange={onChange}
            required
            fullWidth
            type="tel"
            inputProps={{ inputMode: 'numeric', style: { fontSize: 20 } }}
          />
          <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.8, fontSize: 20 }}>
            {loading ? 'Empezando…' : 'Empezar a jugar'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
