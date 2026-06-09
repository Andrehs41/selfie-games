import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { listUsers, stats, exportCsv } from '../controllers/adminController.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/users', listUsers);
router.get('/users.csv', exportCsv);
router.get('/stats', stats);

export default router;
