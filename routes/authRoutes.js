const express = require('express');
const router = express.Router(); // Importa o módulo express para criar rotas
const db = require('../db'); // Importa a conexão com o banco de dados

// Rota para registrar utilizador
router.post('/register', (req, res) => {
    const { nome, email, password} = req.body;

    if (!nome || !email || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    } 

    const sql = 'INSERT INTO users (nome, email, password) VALUES (?, ?, ?)';
    db.query(sql, [nome, email, password], (err, result) => {
        if (err) {
            console.error('Erro ao registrar utilizador:', err);
            return res.status(500).json({ error: 'Erro ao registrar utilizador.' });
        }
        res.status(201).json({ message: 'Utilizador registrado com sucesso!' });
    });

});

// Rota para login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos!' });
    }
  
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error('Erro no login:', err);
        return res.status(500).json({ error: 'Erro no servidor.' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ error: 'Utilizador não encontrado.' });
      }
  
      const user = results[0];
  
      if (user.password !== password) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }
  
      // Sessão: salvar o utilizador logado (precisamos configurar express-session)
      req.session.user = { id: user.id, nome: user.nome, email: user.email };
  
      return res.status(200).json({ message: 'Login efetuado com sucesso!' });
    });
  });
  
  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
          console.error('Erro ao fazer logout:', err);
          return res.status(500).send('Erro ao sair');
        }
        res.redirect('/login.html');
      });
    });
    
  
//
module.exports = router;