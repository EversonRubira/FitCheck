const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../utils/logger');
const { requireAuth } = require('../middleware/auth');
const { validateIMC } = require('../middleware/validation');

// Rota para registrar um cálculo de IMC
router.post('/registrar', requireAuth, validateIMC, async (req, res, next) => {
    try {
        const user = req.session.user;
        const { peso, altura, imc, classificacao } = req.body;

        const sql = 'INSERT INTO imc_records (user_id, peso, altura, imc, classificacao) VALUES (?, ?, ?, ?, ?)';
        const values = [user.id, peso, altura, imc, classificacao];

        const [result] = await db.query(sql, values);

        logger.info('IMC registrado', {
            userId: user.id,
            imcId: result.insertId,
            imc: imc
        });

        res.status(201).json({
            message: 'Cálculo de IMC salvo com sucesso!',
            id: result.insertId
        });

    } catch (err) {
        logger.error('Erro ao salvar IMC:', err);
        next(err);
    }
});

// Rota para buscar histórico de IMC com paginação
router.get('/historico', requireAuth, async (req, res, next) => {
    try {
        const user = req.session.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Buscar registros com paginação
        const sql = 'SELECT * FROM imc_records WHERE user_id = ? ORDER BY data_registro DESC LIMIT ? OFFSET ?';
        const [records] = await db.query(sql, [user.id, limit, offset]);

        // Contar total de registros
        const [countResult] = await db.query(
            'SELECT COUNT(*) as total FROM imc_records WHERE user_id = ?',
            [user.id]
        );

        const total = countResult[0].total;

        res.status(200).json({
            message: 'Histórico carregado com sucesso!',
            historico: records,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (err) {
        logger.error('Erro ao buscar histórico:', err);
        next(err);
    }
});

// Rota para deletar um registro de IMC
router.delete('/deletar/:id', requireAuth, async (req, res, next) => {
    try {
        const user = req.session.user;
        const recordId = parseInt(req.params.id);

        if (!recordId) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        // Verificar se o registro pertence ao usuário
        const [records] = await db.query(
            'SELECT user_id FROM imc_records WHERE id = ?',
            [recordId]
        );

        if (records.length === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        if (records[0].user_id !== user.id) {
            return res.status(403).json({ error: 'Você não tem permissão para deletar este registro' });
        }

        // Deletar registro
        await db.query('DELETE FROM imc_records WHERE id = ?', [recordId]);

        logger.info('Registro de IMC deletado', {
            userId: user.id,
            recordId
        });

        res.status(200).json({
            message: 'Registro deletado com sucesso!'
        });

    } catch (err) {
        logger.error('Erro ao deletar registro:', err);
        next(err);
    }
});

// Rota para buscar estatísticas do usuário
router.get('/estatisticas', requireAuth, async (req, res, next) => {
    try {
        const user = req.session.user;

        const [stats] = await db.query(`
            SELECT
                COUNT(*) as total_registros,
                AVG(imc) as imc_medio,
                MIN(imc) as imc_minimo,
                MAX(imc) as imc_maximo,
                AVG(peso) as peso_medio,
                MIN(data_registro) as primeiro_registro,
                MAX(data_registro) as ultimo_registro
            FROM imc_records
            WHERE user_id = ?
        `, [user.id]);

        res.status(200).json({
            message: 'Estatísticas carregadas com sucesso!',
            estatisticas: stats[0]
        });

    } catch (err) {
        logger.error('Erro ao buscar estatísticas:', err);
        next(err);
    }
});

module.exports = router;
