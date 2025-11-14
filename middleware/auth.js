// Middleware para verificar se o usuário está autenticado
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({
            error: 'Não autorizado. Faça login primeiro.'
        });
    }
    next();
};

module.exports = { requireAuth };
