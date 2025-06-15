const Perfil = require('../models/Perfil');

// Mostra o formulário de perfil para ver/editar (preenchido ou vazio)
const getPerfil = async (req, res) => {
  const userId = req.session.userId;

  try {
    const perfil = await Perfil.findOne({ where: { userId } });

    if (!perfil) {
      // Não existe perfil: mostra formulário vazio
      return res.render('perfil', {
        idade: '',
        altura: '',
        peso: '',
        success: null,
        error: null
      });
    }

    // Perfil existe: mostra formulário preenchido
    res.render('perfil', {
      idade: perfil.idade,
      altura: perfil.altura,
      peso: perfil.peso,
      success: null,
      error: null
    });
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    res.render('perfil', {
      idade: '',
      altura: '',
      peso: '',
      success: null,
      error: 'Erro ao carregar perfil.'
    });
  }
};

// Atualiza ou cria o perfil do utilizador
const updatePerfil = async (req, res) => {
  const userId = req.session.userId;
  const { idade, altura, peso } = req.body;

  if (!idade || !altura || !peso) {
    return res.render('perfil', {
      idade,
      altura,
      peso,
      success: null,
      error: 'Todos os campos são obrigatórios.'
    });
  }

  try {
    let perfil = await Perfil.findOne({ where: { userId } });

    // Se já existe perfil, só PRO pode atualizar
    if (perfil) {
      if (req.session.userTipo !== 'pro') {
        return res.status(403).render('erro403', {
          mensagem: 'Apenas utilizadores PRO podem editar o perfil.'
        });
      }

      perfil.idade = idade;
      perfil.altura = altura;
      perfil.peso = peso;
      await perfil.save();

      return res.render('perfil', {
        idade,
        altura,
        peso,
        success: 'Perfil atualizado com sucesso!',
        error: null
      });
    }

    // Se não existe perfil, qualquer usuário pode criar
    await Perfil.create({ userId, idade, altura, peso });

    return res.render('perfil', {
      idade,
      altura,
      peso,
      success: 'Perfil criado com sucesso!',
      error: null
    });

  } catch (error) {
    console.error("Erro ao salvar perfil:", error);
    res.render('perfil', {
      idade,
      altura,
      peso,
      success: null,
      error: 'Erro ao guardar perfil.'
    });
  }
};


module.exports = { getPerfil, updatePerfil };
