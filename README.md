# FitCheck - Calculadora de IMC com Histórico

Este projeto foi desenvolvido como parte da Unidade Curricular de Programação Web (2025) no Instituto Politécnico de Setúbal.

## Objetivo

Permitir que utilizadores registados calculem seu IMC (Índice de Massa Corporal), visualizem a classificação correspondente e mantenham um histórico pessoal com seus resultados anteriores.

## Funcionalidades

- Registo de utilizadores
- Login com sessão
- Cálculo automático de IMC
- Armazenamento do cálculo por utilizador
- Listagem do histórico pessoal
- Logout e proteção de páginas
- Navegação simples entre páginas

## Tecnologias Utilizadas

- HTML5, CSS3 e JavaScript (DOM, fetch)
- Node.js e Express.js
- MySQL
- express-session

## Estrutura do Projeto

- `/views`: páginas HTML (login, registro, index, histórico)
- `/public`: ficheiros CSS e JS
- `/routes`: rotas separadas (`authRoutes`, `imcRoutes`)
- `server.js`: configuração principal
- `db.js`: ligação ao MySQL

## Como Executar

1. Clonar ou copiar os ficheiros do projeto
2. Executar `npm install` para instalar as dependências
3. Criar a base de dados `fitcheck` no MySQL com as tabelas `users` e `imc_records`
4. Executar `node server.js`
5. Aceder a `http://localhost:3000` no navegador

## Observações

- As páginas principais estão protegidas por sessão
- O histórico só é visível após login
- O projeto foi mantido simples, com foco na funcionalidade

