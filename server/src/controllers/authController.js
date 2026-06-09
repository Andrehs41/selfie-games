const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User.js');

function signToken(user) {
  return jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function register(req, res) {
  try {
    const { nombre, email, telefono, password } = req.body || {};

    if (!nombre || !email || !telefono || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Email no válido' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ nombre, email, telefono, passwordHash });

    return res.status(201).json({ token: signToken(user), user: user.toPublic() });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ error: 'Error al registrar' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Credenciales incorrectas' });

    return res.json({ token: signToken(user), user: user.toPublic() });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

async function me(req, res) {
  return res.json({ user: req.user.toPublic() });
}

module.exports = { register, login, me };
