const Meta = require('../models/Meta');

// Mostra o formulário de metas (preenchido ou vazio)
const getMetas = async (req, res) => {
  const userId = req.session.userId;

  try {
    const metas = await Meta.findOne({ where: { userId } });

    if (!metas) {
      // Não existe meta: mostra formulário vazio
      return res.render('metas', {
        pesoIdeal: '',
        sonoMinimo: '',
        aguaDiariaMl: '',
        success: null,
        error: null
      });
    }

    // Meta existe: mostra formulário preenchido
    res.render('metas', {
      pesoIdeal: metas.pesoIdeal,
      sonoMinimo: metas.sonoMinimo,
      aguaDiariaMl: metas.aguaDiariaMl,
      success: null,
      error: null
    });
  } catch (error) {
    console.error("Erro ao buscar metas:", error);
    res.render('metas', {
      pesoIdeal: '',
      sonoMinimo: '',
      aguaDiariaMl: '',
      success: null,
      error: 'Erro ao buscar metas.'
    });
  }
};

// Define ou atualiza as metas do utilizador
const setMetas = async (req, res) => {
  const userId = req.session.userId;
  const { pesoIdeal, sonoMinimo, aguaDiariaMl } = req.body;

  if (!pesoIdeal || !sonoMinimo || !aguaDiariaMl) {
    return res.render('metas', {
      pesoIdeal,
      sonoMinimo,
      aguaDiariaMl,
      success: null,
      error: 'Todos os campos são obrigatórios.'
    });
  }

  try {
    let metas = await Meta.findOne({ where: { userId } });

    if (metas) {
      // Atualiza metas se já existiam
      metas.pesoIdeal = pesoIdeal;
      metas.sonoMinimo = sonoMinimo;
      metas.aguaDiariaMl = aguaDiariaMl;
      await metas.save();
      res.render('metas', {
        pesoIdeal,
        sonoMinimo,
        aguaDiariaMl,
        success: 'Metas atualizadas com sucesso!',
        error: null
      });
    } else {
      // Cria novas metas
      await Meta.create({ userId, pesoIdeal, sonoMinimo, aguaDiariaMl });
      res.render('metas', {
        pesoIdeal,
        sonoMinimo,
        aguaDiariaMl,
        success: 'Metas criadas com sucesso!',
        error: null
      });
    }
  } catch (error) {
    console.error("Erro ao salvar metas:", error);
    res.render('metas', {
      pesoIdeal,
      sonoMinimo,
      aguaDiariaMl,
      success: null,
      error: 'Erro ao guardar metas.'
    });
  }
};

module.exports = { getMetas, setMetas };
