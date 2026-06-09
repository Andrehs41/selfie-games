const { Router } = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth.js');
const { listUsers, stats, exportCsv } = require('../controllers/adminController.js');

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/users', listUsers);
router.get('/users.csv', exportCsv);
router.get('/stats', stats);

module.exports = router;
