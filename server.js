const express = require('express');
const app = express();
const path = require('path');
const db = require('./db');
const session = require('express-session');

// Sessão
app.use(session({
  secret: 'segredo-super-seguro',
  resave: false,
  saveUninitialized: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Rota para registrar um cálculo de IMC
const imcRoutes = require('./routes/imcRoutes');
app.use('/imc', imcRoutes);


// Páginas manuais
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/historico.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'historico.html'));
});


// Start do servidor SEMPRE depois das rotas
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});




  

