const express = require('express');
const router = express.Router();
const db = require('../db');

// Rota para registrar um cálculo de IMC
router.post('/registrar', (req, res) => {
  const user = req.session.user;

    // Verifica se o usuário está logado
  if (!user) {
    return res.status(401).json({ error: 'Não autorizado. Faça login.' });
  }

  const { peso, altura, imc, classificacao } = req.body;

  if (!peso || !altura || !imc || !classificacao) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const sql = 'INSERT INTO imc_records (user_id, peso, altura, imc, classificacao) VALUES (?, ?, ?, ?, ?)';
  const values = [user.id, peso, altura, imc, classificacao];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao salvar IMC:', err);
      return res.status(500).json({ error: 'Erro ao salvar cálculo.' });
    }

    res.status(201).json({ message: 'Cálculo de IMC salvo com sucesso!' });
  });
});

router.get('/historico', (req, res) => {
    const user = req.session.user;
  
    if (!user) {
      return res.status(401).json({ error: 'Não autorizado. Faça login.' });
    }
  
    const sql = 'SELECT * FROM imc_records WHERE user_id = ? ORDER BY data_registro DESC';
    db.query(sql, [user.id], (err, results) => {
      if (err) {
        console.error('Erro ao buscar histórico:', err);
        return res.status(500).json({ error: 'Erro ao buscar histórico.' });
      }
  
      res.status(200).json({
        message: 'Histórico carregado com sucesso!',
        historico: results
      });
    });
  });
  



module.exports = router;
