const { Router } = require('express');
const { requireAuth } = require('../middleware/auth.js');
const {
  getTrivia,
  submitTrivia,
  getRuleta,
  spinRuleta,
} = require('../controllers/gameController.js');

const router = Router();

router.use(requireAuth);

router.get('/trivia', getTrivia);
router.post('/trivia', submitTrivia);
router.get('/ruleta', getRuleta);
router.post('/ruleta', spinRuleta);

module.exports = router;
