import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getTrivia,
  submitTrivia,
  getRuleta,
  spinRuleta,
} from '../controllers/gameController.js';

const router = Router();

router.use(requireAuth);

router.get('/trivia', getTrivia);
router.post('/trivia', submitTrivia);
router.get('/ruleta', getRuleta);
router.post('/ruleta', spinRuleta);

export default router;
