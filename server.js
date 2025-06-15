const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo-padrao',
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// 🧠 IMPORTA MODELOS (na ordem correta)
const User = require('./models/User');
const Perfil = require('./models/Perfil');
const Registro = require('./models/Registro');
const Meta = require('./models/Meta');

// Importa relações (se tiver um arquivo só para isso, ótimo)

// Rotas
app.use('/', require('./routes/mainRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/perfil', require('./routes/perfilRoutes'));
app.use('/registros', require('./routes/registrosRoutes'));
app.use('/metas', require('./routes/metasRoutes'));

// Rota 404
app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

// 🔄 Sincroniza com `force: true` (⚠️ REMOVE TUDO)
sequelize.sync().then(() => {
  console.log('Modelos sincronizados com a base de dados.');
  app.listen(PORT, () => {
    console.log(`Servidor FitCheck a correr na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao iniciar a aplicação:', err);
});
