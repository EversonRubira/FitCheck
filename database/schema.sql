-- FitCheck Database Schema
-- Execute este script para criar o banco de dados e as tabelas necessárias

CREATE DATABASE IF NOT EXISTS fitcheck CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE fitcheck;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de registros de IMC
CREATE TABLE IF NOT EXISTS imc_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    peso DECIMAL(5,2) NOT NULL,
    altura DECIMAL(3,2) NOT NULL,
    imc DECIMAL(5,2) NOT NULL,
    classificacao VARCHAR(50) NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_data_registro (data_registro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir usuário de teste (senha: Test1234)
-- Hash bcrypt da senha 'Test1234'
INSERT INTO users (nome, email, password) VALUES
('Usuário Teste', 'teste@fitcheck.com', '$2b$10$YourHashedPasswordHere')
ON DUPLICATE KEY UPDATE nome=nome;

-- Visualizar estrutura das tabelas
DESCRIBE users;
DESCRIBE imc_records;
