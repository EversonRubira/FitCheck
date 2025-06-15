const express = require('express');
const router = express.Router();

const Perfil = require('../models/Perfil');
const Meta = require('../models/Meta');
const Registro = require('../models/Registro');

// Dashboard protegido (lógica do feedback IMC e metas)
router.get('/dashboard', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  let imcTexto = 'IMC não disponível';
  let feedback = '';
  const userId = req.session.userId;

  try {
    const [perfil, meta, registros] = await Promise.all([
      Perfil.findOne({ where: { userId } }),
      Meta.findOne({ where: { userId } }),
      Registro.findAll({
        where: { userId },
        order: [['data', 'DESC']],
        limit: 3
      })
    ]);

    // IMC
    if (perfil) {
      const imc = (perfil.peso / (perfil.altura * perfil.altura)).toFixed(2);
      let classificacao = '';

      if (imc < 18.5) classificacao = 'Abaixo do peso';
      else if (imc < 25) classificacao = 'Peso normal';
      else if (imc < 30) classificacao = 'Sobrepeso';
      else classificacao = 'Obesidade';

      imcTexto = `IMC atual: ${imc} (${classificacao})`;

      if (meta && meta.pesoIdeal && perfil.peso > meta.pesoIdeal) {
        feedback += `<p>⚠️ Seu peso atual (${perfil.peso} kg) está acima da meta (${meta.pesoIdeal} kg).</p>`;
      }
    }

    // Sono e água - média dos últimos 3 dias
    if (meta && registros.length > 0) {
      const mediaSono = (registros.reduce((s, r) => s + r.horasSono, 0) / registros.length).toFixed(1);
      const mediaAgua = (registros.reduce((s, r) => s + r.aguaMl, 0) / registros.length).toFixed(0);

      if (meta.sonoMinimo && mediaSono < meta.sonoMinimo) {
        feedback += `<p>😴 Média de sono nos últimos dias: ${mediaSono}h (abaixo da meta de ${meta.sonoMinimo}h).</p>`;
      } else {
        feedback += `<p>✅ Sono dentro da meta! Média: ${mediaSono}h.</p>`;
      }

      if (meta.aguaDiariaMl && mediaAgua < meta.aguaDiariaMl) {
        feedback += `<p>🚰 Ingestão média de água: ${mediaAgua}ml (abaixo da meta de ${meta.aguaDiariaMl}ml).</p>`;
      } else {
        feedback += `<p>✅ Hidratação dentro da meta! Média: ${mediaAgua}ml.</p>`;
      }
    }

    if (feedback === '') {
      feedback = '<p>Nenhum alerta. Tudo parece estar dentro das metas.</p>';
    }
  } catch (error) {
    console.error("Erro no dashboard:", error);
    feedback = '<p>Erro ao carregar dados para feedback.</p>';
  }

  // Renderize um EJS chamado "dashboard.ejs" (você pode criar um simples baseado no conteúdo abaixo)
  res.render('dashboard', {
    nome: req.session.userName || 'Utilizador',
    imcTexto,
    feedback
  });
});

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

// Página de IMC (se quiser manter como ferramenta)
router.get('/imc', (req, res) => {
  res.render('imc');
});

// Histórico de registos (protegido)
const { getHistorico } = require('../controllers/registroController');
router.get('/historico', getHistorico);


// Página de consulta de registo por data (protegida)
router.get('/consulta', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('consulta_dia');
});

// Formulário de registo diário (protegido)
router.get('/registro', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('registro');
});

// Páginas de perfil e metas acessíveis pelas rotas /perfil e /metas nas rotas específicas!

module.exports = router;

