require('dotenv').config();
const mysql = require('mysql2');

// Configuração do pool de conexões com o banco de dados MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'fitcheck',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Testar conexão
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        process.exit(1);
    }
    console.log('Conectado ao MySQL com sucesso!');
    connection.release();
});

// Exporta a versão com promises para usar async/await
module.exports = pool.promise();

