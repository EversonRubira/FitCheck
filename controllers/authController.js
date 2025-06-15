const bcrypt = require('bcrypt');
const User = require('../models/User');
const saltRounds = 10;

// Função para registar um novo utilizador
const register = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  // Validação básica
  if (!nome || !email || !senha) {
    return res.status(400).render('register', { error: "Todos os campos são obrigatórios." });
  }

  try {
    // Verifica se email já está em uso
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).render('register', { error: "Este email já está registado." });
    }

    // Gera hash da senha
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // Cria novo usuário
    const novoUsuario = await User.create({
      nome: nome.trim(),
      email: email.trim(),
      senha: hashedPassword,
      tipo: tipo || 'comum'
    });

    // Cria sessão para o usuário
    req.session.userId = novoUsuario.id;
    req.session.userName = novoUsuario.nome;
    req.session.userTipo = novoUsuario.tipo;

    res.redirect('/dashboard');
  } catch (error) {
    console.error("Erro ao registar utilizador:", error);
    res.status(500).render('register', { error: "Erro interno ao registar. Tente novamente." });
  }
};

// Função para login
const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).render('login', { error: "Todos os campos são obrigatórios." });
  }

  try {
    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).render('login', { error: "Email ou senha inválidos." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).render('login', { error: "Email ou senha inválidos." });
    }

    req.session.userId = usuario.id;
    req.session.userName = usuario.nome;
    req.session.userTipo = usuario.tipo;

    res.redirect('/dashboard');
  } catch (error) {
    console.error("Erro ao logar utilizador:", error);
    res.status(500).render('login', { error: "Erro interno ao autenticar. Tente novamente." });
  }
};

// Função para logout
const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Erro ao encerrar sessão:", err);
      return res.redirect('/login');
    }
    res.redirect('/login');
  });
};

module.exports = { register, login, logout };
