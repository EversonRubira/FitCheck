const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Ambas rotas protegidas por login, mas sem checar tipo aqui
router.get('/', isAuthenticated, perfilController.getPerfil);
router.post('/', isAuthenticated, perfilController.updatePerfil);

module.exports = router;
