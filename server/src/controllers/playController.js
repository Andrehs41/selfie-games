const { Participant } = require('../models/Participant.js');
const { TRIVIA_QUESTIONS, publicQuestions } = require('../data/trivia.js');
const { ROULETTE_SEGMENTS, publicSegments, pickSegmentIndex } = require('../data/roulette.js');

const PHONE_RE = /^[0-9+\s()-]{7,15}$/;

// POST /api/play  { nombre, telefono } → crea participante y empieza la sesión.
async function start(req, res) {
  const { nombre, telefono } = req.body || {};
  if (!nombre || !String(nombre).trim()) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }
  if (!telefono || !PHONE_RE.test(String(telefono).trim())) {
    return res.status(400).json({ error: 'Teléfono no válido' });
  }
  const p = await Participant.create({
    nombre: String(nombre).trim(),
    telefono: String(telefono).trim(),
  });
  return res.status(201).json({ participant: p.toPublic() });
}

// Premio de la trivia según aciertos (pedido del cliente):
//   0–4 → sigue intentando | 5–7 → Bono 20% Off | 8 → Kit Viajero
function triviaPrize(score) {
  if (score >= 8) return { prizeLabel: 'Kit Viajero', prizeType: 'win' };
  if (score >= 5) return { prizeLabel: 'Bono 20% Off', prizeType: 'win' };
  return { prizeLabel: 'Sigue intentando', prizeType: 'retry' };
}

// GET /api/play/trivia → preguntas (mezcladas, sin respuesta correcta).
function getTrivia(req, res) {
  return res.json({ questions: publicQuestions() });
}

// POST /api/play/:id/trivia { answers } → valida y guarda.
async function submitTrivia(req, res) {
  const p = await Participant.findById(req.params.id);
  if (!p) return res.status(404).json({ error: 'Participante no encontrado' });
  if (p.games.trivia.played) {
    return res.status(409).json({ error: 'Trivia ya jugada', result: p.games.trivia });
  }
  const answers = (req.body && req.body.answers) || {};
  let score = 0;
  const detail = TRIVIA_QUESTIONS.map((q) => {
    const correct = Number(answers[q.id]) === q.correct;
    if (correct) score += 1;
    return { id: q.id, correct, correctIndex: q.correct };
  });
  const prize = triviaPrize(score);
  p.games.trivia = {
    played: true,
    score,
    total: TRIVIA_QUESTIONS.length,
    prizeLabel: prize.prizeLabel,
    prizeType: prize.prizeType,
    playedAt: new Date(),
  };
  await p.save();
  return res.json({ score, total: TRIVIA_QUESTIONS.length, detail, prize, result: p.games.trivia });
}

// GET /api/play/ruleta → segmentos para dibujar la rueda.
function getRuleta(req, res) {
  return res.json({ segments: publicSegments() });
}

// POST /api/play/:id/ruleta → el servidor decide el premio y lo guarda.
async function spinRuleta(req, res) {
  const p = await Participant.findById(req.params.id);
  if (!p) return res.status(404).json({ error: 'Participante no encontrado' });
  if (p.games.ruleta.played) {
    return res.status(409).json({ error: 'Ruleta ya jugada', result: p.games.ruleta });
  }
  const index = pickSegmentIndex();
  const seg = ROULETTE_SEGMENTS[index];
  p.games.ruleta = {
    played: true,
    prizeIndex: index,
    prizeLabel: seg.label,
    prizeType: seg.type,
    playedAt: new Date(),
  };
  await p.save();
  return res.json({ prizeIndex: index, prizeLabel: seg.label, prizeType: seg.type, result: p.games.ruleta });
}

module.exports = { start, getTrivia, submitTrivia, getRuleta, spinRuleta };
