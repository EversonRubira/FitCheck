const express = require('express');
const router = express.Router();
const metasController = require('../controllers/metasController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { isPro } = require('../middleware/tipoMiddleware');

// Página de metas (somente PRO)
router.get('/', isAuthenticated, isPro, metasController.getMetas);

// Submissão de metas (somente PRO)
router.post('/', isAuthenticated, isPro, metasController.setMetas);

module.exports = router;
