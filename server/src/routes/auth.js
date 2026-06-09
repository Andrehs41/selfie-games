const { Router } = require('express');
const { login, me } = require('../controllers/authController.js');
const { requireAuth } = require('../middleware/auth.js');

// Solo para el ADMIN (los participantes del kiosko no usan login).
const router = Router();

router.post('/login', login);
router.get('/me', requireAuth, me);

module.exports = router;
