const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Dashboard protegido
router.get('/dashboard', isAuthenticated, getDashboard);

// Página inicial
router.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('index');
});

// Página de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Página de registo
router.get('/register', (req, res) => {
  res.render('register');
});

// Página de IMC
router.get('/imc', (req, res) => {
  res.render('imc');
});

// Histórico de registos
const { getHistorico } = require('../controllers/registroController');
router.get('/historico', getHistorico);

// Consulta por data
router.get('/consulta', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('consulta_dia');
});

// Formulário de registo
router.get('/registro', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('registro');
});

module.exports = router;
