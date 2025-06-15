# FitCheck – Aplicação Web de Bem-Estar Físico

## 📋 Descrição
O FitCheck é uma aplicação web criada para ajudar utilizadores a monitorar hábitos saudáveis, como sono, ingestão de água, IMC e metas físicas.

Este projeto foi desenvolvido como parte da UC de Programação Web – 2024/2025.

## 👨‍💻 Desenvolvedores
- Backend: Everson Rubira
- Frontend: [nome do colega]
- Organização/documentação: [nome do colega]

## 🧱 Estrutura de Pastas
```
FitCheck/
├── server.js
├── .env
├── package.json
├── public/            # CSS e JS do frontend
├── views/             # HTMLs das páginas
├── routes/            # Arquivos de rotas
├── controllers/       # Funções de lógica backend
├── middleware/        # Middlewares de sessão e erros
├── models/            # Planeamento do banco de dados (fase 2)
```

## 🚀 Como executar
1. Instale as dependências:
```
npm install
```

2. Inicie o servidor:
```
node server.js
```

3. Acesse no navegador:
```
http://localhost:3000
```

## ✅ Rotas principais
- `/` → Dashboard
- `/login` → Página de login
- `/register` → Página de registo
- `/perfil` → Ver ou atualizar dados fixos
- `/registros` → Histórico de registos
- `/registros/:data` → Consulta por data
- `/metas` → Definir e visualizar metas

## ⚠️ Observações
- Esta é a Fase 1 do projeto. Os dados ainda não são persistidos em banco.
- As respostas dos controladores são simuladas com `res.send(...)`.
- O HTML foi feito de forma estática e será melhorado na Fase 2.

## 📁 Requisitos Técnicos
- Node.js LTS
- Express
- express-session
- dotenv

---

*Projeto académico desenvolvido para fins de aprendizagem.*
