import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { TextField, Button, Stack, Alert, Link, Typography } from '@mui/material';
import AuthLayout from '../components/AuthLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Crear cuenta" subtitle="Regístrate para participar en los juegos">
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Nombre completo"
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            required
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            fullWidth
          />
          <TextField
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={onChange}
            required
            fullWidth
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            fullWidth
            helperText="Mínimo 6 caracteres"
          />
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? 'Creando…' : 'Registrarme'}
          </Button>
          <Typography variant="body2" textAlign="center" color="text.secondary">
            ¿Ya tienes cuenta?{' '}
            <Link component={RouterLink} to="/login" underline="hover">
              Inicia sesión
            </Link>
          </Typography>
        </Stack>
      </form>
    </AuthLayout>
  );
}
