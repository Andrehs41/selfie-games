require('dotenv/config');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db.js');
const authRoutes = require('./routes/auth.js');
const playRoutes = require('./routes/play.js');
const adminRoutes = require('./routes/admin.js');

const app = express();

// Juego público de marketing protegido por JWT (no por cookies), así que CORS
// no es la barrera de seguridad: permitimos cualquier origen para evitar fallos
// intermitentes (varias instancias, URLs preview, conexiones lentas, redeploys).
app.use(cors());
app.use(express.json());

// Health check: indica también el estado de la DB para diagnóstico.
app.get('/api/health', (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.json({
    ok: true,
    db: dbReady ? 'conectada' : 'desconectada',
    port: PORT,
    mongoUriSet: Boolean(process.env.MONGODB_URI),
    jwtSet: Boolean(process.env.JWT_SECRET),
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/play', playRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/selfie-games';

// El servidor escucha SIEMPRE (aunque Mongo falle), así /api/health responde y
// podemos diagnosticar. La conexión a la DB ocurre aparte y no tumba el proceso.
// Sin host fijo: Node maneja tanto puerto numérico como socket (Passenger).
app.listen(PORT, () => console.log(`🚀 API escuchando en puerto ${PORT}`));

// Reintenta la conexión hasta lograrla (p. ej. si Atlas tarda o el whitelist
// se agregó después de arrancar). No tumba el HTTP.
function connectWithRetry() {
  connectDB(MONGODB_URI).catch((err) => {
    console.error('❌ Mongo no conectó, reintento en 5s:', err.message);
    setTimeout(connectWithRetry, 5000);
  });
}
connectWithRetry();
