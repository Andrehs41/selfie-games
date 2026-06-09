// Crea (o promueve) un usuario administrador.
// Uso:  node src/scripts/seedAdmin.js  (lee ADMIN_* del .env)
//   o:  node src/scripts/seedAdmin.js admin@correo.com MiClave123 "Nombre Admin"
require('dotenv/config');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { connectDB } = require('../config/db.js');
const { User } = require('../models/User.js');

async function main() {
  const email = (process.argv[2] || process.env.ADMIN_EMAIL || '').toLowerCase();
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;
  const nombre = process.argv[4] || process.env.ADMIN_NOMBRE || 'Administrador';

  if (!email || !password) {
    console.error('Falta email/password. Usa argumentos o define ADMIN_EMAIL y ADMIN_PASSWORD en .env');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/selfie-games';
  await connectDB(uri);

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'admin';
    if (password) existing.passwordHash = await bcrypt.hash(password, 10);
    await existing.save();
    console.log(`✅ Usuario existente promovido a admin: ${email}`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ nombre, email, telefono: '-', passwordHash, role: 'admin' });
    console.log(`✅ Admin creado: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Error en seedAdmin:', err);
  process.exit(1);
});
