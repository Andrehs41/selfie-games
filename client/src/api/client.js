import axios from 'axios';

// En desarrollo usamos el proxy de Vite (`/api`). En producción (Vercel) se
// define VITE_API_URL con la URL del backend, p. ej. https://tu-backend.onrender.com/api
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL });

// Adjunta el token guardado en cada petición.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
