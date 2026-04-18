const { Op } = require('sequelize');
const Perfil = require('../models/Perfil');
const Meta = require('../models/Meta');
const Registro = require('../models/Registro');

const getDashboard = async (req, res) => {
  const userId = req.session.userId;
  const userName = req.session.userName || 'Utilizador';

  let imcTexto = 'IMC não disponível';
  let feedback = '';
  let mensagemIncentivo = 'Cuide bem de si! Registe suas atividades e evolua. 🌿';

  const hoje = new Date();
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(hoje.getDate() - 7);

  try {
    const [perfil, meta] = await Promise.all([
      Perfil.findOne({ where: { userId } }),
      Meta.findOne({ where: { userId } }),
    ]);

    const registros = await Registro.findAll({
      where: {
        userId,
        data: { [Op.gte]: seteDiasAtras }
      },
      order: [['data', 'DESC']]
    });

    // Incentivo com base na intensidade do último registo
    const ultimo = registros[0];
    if (ultimo?.intensidade) {
      switch (ultimo.intensidade) {
        case 'sem atividade':
          mensagemIncentivo = '😌 Tudo bem! Comece devagar e vá aumentando.';
          break;
        case 'leve':
          mensagemIncentivo = '💡 Vamos lá! Um passo leve ainda é um passo!';
          break;
        case 'moderada':
          mensagemIncentivo = '👏 Ótimo ritmo! Mantenha essa energia saudável!';
          break;
        case 'intensa':
          mensagemIncentivo = '🔥 Impressionante! Continue com essa intensidade!';
          break;
      }
    }

    // Cálculo do IMC
    if (perfil) {
      const imc = (perfil.peso / (perfil.altura * perfil.altura)).toFixed(2);
      let classificacao = '';
      if (imc < 18.5) classificacao = 'Abaixo do peso';
      else if (imc < 25) classificacao = 'Peso normal';
      else if (imc < 30) classificacao = 'Sobrepeso';
      else classificacao = 'Obesidade';

      imcTexto = `IMC atual: ${imc} (${classificacao})`;

      if (meta?.pesoIdeal && perfil.peso > meta.pesoIdeal) {
        feedback += `<p>⚠️ Seu peso atual (${perfil.peso} kg) está acima da meta (${meta.pesoIdeal} kg).</p>`;
      }
    }

    // Médias de sono e água
    if (meta && registros.length > 0) {
      const mediaSono = (registros.reduce((s, r) => s + r.horasSono, 0) / registros.length).toFixed(1);
      const mediaAgua = (registros.reduce((s, r) => s + r.aguaMl, 0) / registros.length).toFixed(0);

      if (meta.sonoMinimo && mediaSono < meta.sonoMinimo) {
        feedback += `<p>😴 Média de sono diária: ${mediaSono}h (abaixo da meta de ${meta.sonoMinimo}h).</p>`;
      } else {
        feedback += `<p>✅ Sono dentro da meta! Média: ${mediaSono}h.</p>`;
      }

      if (meta.aguaDiariaMl && mediaAgua < meta.aguaDiariaMl) {
        feedback += `<p>🚰 Água: ${mediaAgua}ml (abaixo da meta diária de ${meta.aguaDiariaMl}ml).</p>`;
      } else {
        feedback += `<p>✅ Hidratação em dia! Média: ${mediaAgua}ml.</p>`;
      }
    }

    if (feedback === '') {
      feedback = '<p>Nenhum alerta. Tudo parece estar dentro das metas.</p>';
    }

    res.render('dashboard', { nome: userName, imcTexto, feedback, mensagemIncentivo });

  } catch (error) {
    console.error('Erro no dashboard:', error);
    res.render('dashboard', {
      nome: userName,
      imcTexto,
      feedback: '<p>Erro ao carregar dados para feedback.</p>',
      mensagemIncentivo
    });
  }
};

module.exports = { getDashboard };
