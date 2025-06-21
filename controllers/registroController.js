const Registro = require('../models/Registro');
const { Op } = require('sequelize');

// Exibe formulário vazio de novo registro
const mostrarFormulario = (req, res) => {
  res.render('registro', {
    data: '',
    horasSono: '',
    qualidadeSono: '',
    aguaMl: '',
    humor: '',
    tipoAtividade: '',
    intensidade: '',
    qualidadeAlimentacao: '',
    success: null,
    error: null
  });
};

// Salva novo registo diário no banco
const registrar = async (req, res) => {
  const userId = req.session.userId;
  const userTipo = req.session.userTipo;

  const {
    data,
    horasSono,
    qualidadeSono,
    aguaMl,
    humor,
    tipoAtividade,
    intensidade,
    qualidadeAlimentacao
  } = req.body;

  if (!data || !horasSono || !aguaMl || !humor) {
    return res.render('registro', {
      data,
      horasSono,
      qualidadeSono,
      aguaMl,
      humor,
      tipoAtividade,
      intensidade,
      qualidadeAlimentacao,
      success: null,
      error: 'Preencha os campos obrigatórios: data, sono, água e humor.'
    });
  }

  try {
    // Limite de 3 registos para usuário comum
    if (userTipo === 'comum') {
      const count = await Registro.count({ where: { userId } });
      if (count >= 3) {
        return res.status(403).render('erro403', {
          mensagem: 'Limite de 3 registos atingido. Torne-se um utilizador PRO para registar mais.'
        });
      }
    }

    await Registro.create({
      userId,
      data,
      horasSono,
      qualidadeSono,
      aguaMl,
      humor,
      tipoAtividade,
      intensidade,
      qualidadeAlimentacao
    });

    res.render('registro', {
      data: '',
      horasSono: '',
      qualidadeSono: '',
      aguaMl: '',
      humor: '',
      tipoAtividade: '',
      intensidade: '',
      qualidadeAlimentacao: '',
      success: 'Registo salvo com sucesso!',
      error: null
    });
  } catch (error) {
    console.error("Erro ao salvar registo:", error);
    res.render('registro', {
      data,
      horasSono,
      qualidadeSono,
      aguaMl,
      humor,
      tipoAtividade,
      intensidade,
      qualidadeAlimentacao,
      success: null,
      error: 'Erro ao guardar registo.'
    });
  }
};

// Histórico com paginação semanal (últimos 7 dias)
const getHistorico = async (req, res) => {
  const userId = req.session.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

  try {
    const { count, rows } = await Registro.findAndCountAll({
      where: {
        userId,
        data: {
          [Op.gte]: seteDiasAtras
        }
      },
      order: [['data', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    res.render('historico', {
      registros: rows,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).send("Erro ao carregar histórico.");
  }
};

// Consulta por data
const getPorData = async (req, res) => {
  const userId = req.session.userId;
  const data = req.params.data;

  try {
    const registro = await Registro.findOne({ where: { userId, data } });

    if (!registro) {
      return res.render('consulta_resultado', { data, notFound: true });
    }

    res.render('consulta_resultado', {
      data: registro.data,
      horasSono: registro.horasSono,
      qualidadeSono: registro.qualidadeSono,
      aguaMl: registro.aguaMl,
      humor: registro.humor,
      tipoAtividade: registro.tipoAtividade,
      intensidade: registro.intensidade,
      qualidadeAlimentacao: registro.qualidadeAlimentacao,
      notFound: false
    });
  } catch (error) {
    console.error("Erro ao buscar registo:", error);
    res.status(500).send("Erro ao buscar registo.");
  }
};

// Histórico em JSON
const getHistoricoJson = async (req, res) => {
  const userId = req.session.userId;

  try {
    const registros = await Registro.findAll({
      where: { userId },
      order: [['data', 'DESC']]
    });

    res.json(registros);
  } catch (error) {
    console.error("Erro ao buscar histórico JSON:", error);
    res.status(500).json({ error: "Erro ao carregar histórico." });
  }
};

module.exports = {
  mostrarFormulario,
  registrar,
  getHistorico,
  getPorData,
  getHistoricoJson
};
