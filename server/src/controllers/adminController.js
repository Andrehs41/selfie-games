const { Participant } = require('../models/Participant.js');

// GET /api/admin/participants → todos los participantes con sus resultados.
async function listParticipants(req, res) {
  const participants = await Participant.find().sort({ createdAt: -1 }).lean();
  const data = participants.map((p) => ({
    id: p._id,
    nombre: p.nombre,
    telefono: p.telefono,
    createdAt: p.createdAt,
    trivia: p.games?.trivia || { played: false },
    ruleta: p.games?.ruleta || { played: false },
  }));
  return res.json({ count: data.length, participants: data });
}

// GET /api/admin/stats → métricas rápidas para el panel.
async function stats(req, res) {
  const total = await Participant.countDocuments();
  const triviaJugada = await Participant.countDocuments({ 'games.trivia.played': true });
  const ruletaJugada = await Participant.countDocuments({ 'games.ruleta.played': true });
  const premiados = await Participant.countDocuments({ 'games.ruleta.prizeType': 'win' });
  return res.json({ total, triviaJugada, ruletaJugada, premiados });
}

const csvCell = (v) => {
  const s = v === undefined || v === null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// GET /api/admin/participants.csv → exporta leads + resultados.
async function exportCsv(req, res) {
  const participants = await Participant.find().sort({ createdAt: -1 }).lean();
  const headers = [
    'Nombre',
    'Telefono',
    'Registrado',
    'Trivia jugada',
    'Trivia puntaje',
    'Ruleta jugada',
    'Ruleta premio',
  ];
  const rows = participants.map((p) =>
    [
      p.nombre,
      p.telefono,
      p.createdAt ? new Date(p.createdAt).toISOString() : '',
      p.games?.trivia?.played ? 'Si' : 'No',
      p.games?.trivia?.played ? `${p.games.trivia.score}/${p.games.trivia.total}` : '',
      p.games?.ruleta?.played ? 'Si' : 'No',
      p.games?.ruleta?.prizeLabel || '',
    ]
      .map(csvCell)
      .join(',')
  );
  const csv = '﻿' + [headers.join(','), ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="leads-selfie-games.csv"');
  return res.send(csv);
}

// DELETE /api/admin/participants/:id
async function deleteParticipant(req, res) {
  const p = await Participant.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ error: 'Participante no encontrado' });
  return res.json({ ok: true, id: req.params.id });
}

module.exports = { listParticipants, stats, exportCsv, deleteParticipant };
