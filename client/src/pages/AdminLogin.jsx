import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Stack, TextField, Button, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';

// Login del administrador (los participantes del kiosko NO usan login).
export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', p: 2, bgcolor: 'background.default' }}>
      <Paper sx={{ p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 420 }}>
        <Stack spacing={1} sx={{ textAlign: 'center', mb: 3 }}>
          <Box component="img" src="/logo.png" alt="By Mariana Zapata" sx={{ width: 90, mx: 'auto', mb: 1 }} />
          <Typography variant="h4">Panel de administración</Typography>
          <Typography variant="body2" color="text.secondary">Acceso solo para el equipo</Typography>
        </Stack>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Email" name="email" type="email" value={form.email} onChange={onChange} required fullWidth />
            <TextField label="Contraseña" name="password" type="password" value={form.password} onChange={onChange} required fullWidth />
            <Button type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? 'Entrando…' : 'Entrar'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
