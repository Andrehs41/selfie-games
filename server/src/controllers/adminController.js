const { User } = require('../models/User.js');

// GET /api/admin/users → todos los usuarios (jugadores) con sus resultados.
async function listUsers(req, res) {
  const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 }).lean();
  const data = users.map((u) => ({
    id: u._id,
    nombre: u.nombre,
    email: u.email,
    telefono: u.telefono,
    createdAt: u.createdAt,
    trivia: u.games?.trivia || { played: false },
    ruleta: u.games?.ruleta || { played: false },
  }));
  return res.json({ count: data.length, users: data });
}

// GET /api/admin/stats → métricas rápidas para el panel.
async function stats(req, res) {
  const notAdmin = { role: { $ne: 'admin' } };
  const total = await User.countDocuments(notAdmin);
  const triviaJugada = await User.countDocuments({ ...notAdmin, 'games.trivia.played': true });
  const ruletaJugada = await User.countDocuments({ ...notAdmin, 'games.ruleta.played': true });
  const premiados = await User.countDocuments({ ...notAdmin, 'games.ruleta.prizeType': 'win' });
  return res.json({ total, triviaJugada, ruletaJugada, premiados });
}

const csvCell = (v) => {
  const s = v === undefined || v === null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// GET /api/admin/users.csv → exporta los leads + resultados.
async function exportCsv(req, res) {
  const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 }).lean();
  const headers = [
    'Nombre',
    'Email',
    'Telefono',
    'Registrado',
    'Trivia jugada',
    'Trivia puntaje',
    'Ruleta jugada',
    'Ruleta premio',
  ];
  const rows = users.map((u) =>
    [
      u.nombre,
      u.email,
      u.telefono,
      u.createdAt ? new Date(u.createdAt).toISOString() : '',
      u.games?.trivia?.played ? 'Si' : 'No',
      u.games?.trivia?.played ? `${u.games.trivia.score}/${u.games.trivia.total}` : '',
      u.games?.ruleta?.played ? 'Si' : 'No',
      u.games?.ruleta?.prizeLabel || '',
    ]
      .map(csvCell)
      .join(',')
  );
  const csv = '﻿' + [headers.join(','), ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="leads-selfie-games.csv"');
  return res.send(csv);
}

module.exports = { listUsers, stats, exportCsv };
