const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');
const logger = require('../utils/logger');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Rota para registrar utilizador
router.post('/register', validateRegister, async (req, res, next) => {
    try {
        const { nome, email, password } = req.body;

        // Verificar se o email já existe
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                error: 'Este email já está registrado.'
            });
        }

        // Hash da senha com bcrypt (10 rounds)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserir novo usuário
        const sql = 'INSERT INTO users (nome, email, password) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [nome, email, hashedPassword]);

        logger.info('Novo usuário registrado', {
            userId: result.insertId,
            email: email
        });

        res.status(201).json({
            message: 'Utilizador registrado com sucesso!',
            userId: result.insertId
        });

    } catch (err) {
        logger.error('Erro ao registrar utilizador:', err);
        next(err);
    }
});

// Rota para login
router.post('/login', validateLogin, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Buscar usuário por email
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [results] = await db.query(sql, [email]);

        if (results.length === 0) {
            // Usar mensagem genérica para não revelar se o email existe
            return res.status(401).json({
                error: 'Email ou senha incorretos.'
            });
        }

        const user = results[0];

        // Comparar senha com hash usando bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Email ou senha incorretos.'
            });
        }

        // Criar sessão do usuário (não incluir senha)
        req.session.user = {
            id: user.id,
            nome: user.nome,
            email: user.email
        };

        logger.info('Login bem-sucedido', {
            userId: user.id,
            email: user.email
        });

        res.status(200).json({
            message: 'Login efetuado com sucesso!',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email
            }
        });

    } catch (err) {
        logger.error('Erro no login:', err);
        next(err);
    }
});

// Rota para logout
router.get('/logout', (req, res) => {
    const userId = req.session.user?.id;

    req.session.destroy((err) => {
        if (err) {
            logger.error('Erro ao fazer logout:', err);
            return res.status(500).json({ error: 'Erro ao fazer logout' });
        }

        logger.info('Logout realizado', { userId });
        res.redirect('/login.html');
    });
});

// Rota para verificar se o usuário está autenticado
router.get('/me', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            error: 'Não autenticado'
        });
    }

    res.json({
        user: req.session.user
    });
});

module.exports = router;