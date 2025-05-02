const mysql = require ('mysql2');

// Configuração da conexão com o banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'fitcheck'
});

// Conexão com o banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!)');
});

module.exports = connection;

