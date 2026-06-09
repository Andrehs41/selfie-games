import 'dotenv/config';
import express from 'express';
import cors from 'cors';
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

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/selfie-games';

connectDB(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 API escuchando en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ No se pudo conectar a MongoDB:', err.message);
    process.exit(1);
  });
