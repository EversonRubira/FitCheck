require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');

// Importar db para garantir que a conexão é estabelecida
const db = require('./db');

// Segurança - Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    }
}));

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Rate Limiting - Proteção contra força bruta
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 tentativas
    message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requisições
    message: { error: 'Muitas requisições. Tente novamente em 15 minutos.' }
});

app.use('/auth/login', authLimiter);
app.use('/auth/register', authLimiter);
app.use(generalLimiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Sessão com configuração segura
app.use(session({
    secret: process.env.SESSION_SECRET || 'change-this-secret-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS em produção
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 horas
        sameSite: 'strict'
    }
}));

// Rotas de API
const authRoutes = require('./routes/authRoutes');
const imcRoutes = require('./routes/imcRoutes');

app.use('/auth', authRoutes);
app.use('/imc', imcRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (err) {
        logger.error('Health check failed:', err);
        res.status(503).json({
            status: 'error',
            message: 'Database connection failed'
        });
    }
});

// Páginas HTML
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

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Erro não tratado:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method
    });

    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Erro interno do servidor'
            : err.message
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Servidor rodando em http://localhost:${PORT}`);
    logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});




  

