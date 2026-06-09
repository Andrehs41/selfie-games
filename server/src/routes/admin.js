const { Router } = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth.js');
const {
  listParticipants,
  stats,
  exportCsv,
  deleteParticipant,
} = require('../controllers/adminController.js');

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/participants', listParticipants);
router.get('/participants.csv', exportCsv);
router.get('/stats', stats);
router.delete('/participants/:id', deleteParticipant);

module.exports = router;
