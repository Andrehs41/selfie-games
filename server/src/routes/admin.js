const { Router } = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth.js');
const { listUsers, stats, exportCsv, deleteUser } = require('../controllers/adminController.js');

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/users', listUsers);
router.get('/users.csv', exportCsv);
router.get('/stats', stats);
router.delete('/users/:id', deleteUser);

module.exports = router;
