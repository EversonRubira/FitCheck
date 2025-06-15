const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { isPro } = require('../middleware/tipoMiddleware');

// Exibe formulário de registo diário (com render dinâmico)
router.get('/', isAuthenticated, registroController.mostrarFormulario);

// Submete novo registo diário
router.post('/', isAuthenticated, registroController.registrar);

// Retorna histórico JSON (uso interno ou para APIs)
router.get('/json', isAuthenticated, registroController.getHistoricoJson);

// Exibe histórico completo (somente PRO)
router.get('/historico', isAuthenticated, isPro, registroController.getHistorico);

// Consulta por data específica
router.get('/data/:data', isAuthenticated, registroController.getPorData);

module.exports = router;
