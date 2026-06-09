import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/games.js';
import adminRoutes from './routes/admin.js';

const app = express();

// CLIENT_ORIGIN admite varios orígenes separados por coma (p. ej. el dominio de
// producción de Vercel + las preview URLs). '*' permite cualquiera.
const allowedOrigins = (process.env.CLIENT_ORIGIN || '*').split(',').map((s) => s.trim());
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error(`Origen no permitido por CORS: ${origin}`));
    },
  })
);
app.use(express.json());

// Health check: indica también el estado de la DB para diagnóstico.
app.get('/api/health', (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.json({ ok: true, db: dbReady ? 'conectada' : 'desconectada', port: PORT });
});
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/selfie-games';

// El servidor escucha SIEMPRE (aunque Mongo falle), así /api/health responde y
// podemos diagnosticar. La conexión a la DB ocurre aparte y no tumba el proceso.
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 API escuchando en puerto ${PORT}`));

connectDB(MONGODB_URI).catch((err) =>
  console.error('❌ No se pudo conectar a MongoDB:', err.message)
);
