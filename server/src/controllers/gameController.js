const { TRIVIA_QUESTIONS, publicQuestions } = require('../data/trivia.js');
const { ROULETTE_SEGMENTS, publicSegments, pickSegmentIndex } = require('../data/roulette.js');

// --- TRIVIA ---

// GET /api/games/trivia → preguntas sin la respuesta correcta.
function getTrivia(req, res) {
  return res.json({
    played: req.user.games.trivia.played,
    result: req.user.games.trivia,
    questions: publicQuestions(),
  });
}

// POST /api/games/trivia { answers: { [questionId]: optionIndex } }
// Valida en el servidor y guarda el puntaje (una sola vez).
async function submitTrivia(req, res) {
  const user = req.user;
  if (user.games.trivia.played) {
    return res.status(409).json({ error: 'Ya jugaste la trivia', result: user.games.trivia });
  }

  const answers = (req.body && req.body.answers) || {};
  let score = 0;
  const detail = TRIVIA_QUESTIONS.map((q) => {
    const given = answers[q.id];
    const correct = Number(given) === q.correct;
    if (correct) score += 1;
    return { id: q.id, correct, correctIndex: q.correct };
  });

  user.games.trivia = {
    played: true,
    score,
    total: TRIVIA_QUESTIONS.length,
    playedAt: new Date(),
  };
  await user.save();

  return res.json({
    score,
    total: TRIVIA_QUESTIONS.length,
    detail,
    result: user.games.trivia,
  });
}

// --- RULETA ---

// GET /api/games/ruleta → segmentos para dibujar la rueda.
function getRuleta(req, res) {
  return res.json({
    played: req.user.games.ruleta.played,
    result: req.user.games.ruleta,
    segments: publicSegments(),
  });
}

// POST /api/games/ruleta → el servidor decide el premio (una sola vez).
async function spinRuleta(req, res) {
  const user = req.user;
  if (user.games.ruleta.played) {
    return res.status(409).json({ error: 'Ya giraste la ruleta', result: user.games.ruleta });
  }

  const index = pickSegmentIndex();
  const segment = ROULETTE_SEGMENTS[index];

  user.games.ruleta = {
    played: true,
    prizeIndex: index,
    prizeLabel: segment.label,
    prizeType: segment.type,
    playedAt: new Date(),
  };
  await user.save();

  return res.json({
    prizeIndex: index,
    prizeLabel: segment.label,
    prizeType: segment.type,
    result: user.games.ruleta,
  });
}

module.exports = { getTrivia, submitTrivia, getRuleta, spinRuleta };
