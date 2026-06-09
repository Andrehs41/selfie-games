const { Router } = require('express');
const {
  start,
  getTrivia,
  submitTrivia,
  getRuleta,
  spinRuleta,
} = require('../controllers/playController.js');

const router = Router();

// Todas públicas (kiosko del stand, sin login).
router.post('/', start);
router.get('/trivia', getTrivia);
router.post('/:id/trivia', submitTrivia);
router.get('/ruleta', getRuleta);
router.post('/:id/ruleta', spinRuleta);

module.exports = router;
