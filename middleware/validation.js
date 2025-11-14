const { body, validationResult } = require('express-validator');

// Middleware para verificar erros de validação
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Dados inválidos',
            details: errors.array()
        });
    }
    next();
};

// Regras de validação para registro
const validateRegister = [
    body('nome')
        .trim()
        .notEmpty().withMessage('Nome é obrigatório')
        .isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email é obrigatório')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Senha é obrigatória')
        .isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/).withMessage('Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'),
    handleValidationErrors
];

// Regras de validação para login
const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email é obrigatório')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Senha é obrigatória'),
    handleValidationErrors
];

// Regras de validação para registro de IMC
const validateIMC = [
    body('peso')
        .notEmpty().withMessage('Peso é obrigatório')
        .isFloat({ min: 1, max: 500 }).withMessage('Peso deve ser entre 1 e 500 kg'),
    body('altura')
        .notEmpty().withMessage('Altura é obrigatória')
        .isFloat({ min: 0.5, max: 3 }).withMessage('Altura deve ser entre 0.5 e 3 metros'),
    body('imc')
        .notEmpty().withMessage('IMC é obrigatório')
        .isFloat({ min: 1, max: 200 }).withMessage('IMC inválido'),
    body('classificacao')
        .notEmpty().withMessage('Classificação é obrigatória')
        .isIn(['Magreza', 'Normal', 'Sobrepeso', 'Obesidade']).withMessage('Classificação inválida'),
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateIMC
};
