# 💪 FitCheck – Seu Assistente de Bem-Estar

**FitCheck** é uma aplicação web desenvolvida com Node.js, Express e MySQL, que permite calcular e acompanhar seu IMC (Índice de Massa Corporal) ao longo do tempo, ajudando você a monitorar sua saúde e bem-estar.

## 🚀 Funcionalidades

- ✅ Registro e autenticação de usuários com senhas criptografadas (bcrypt)
- ✅ Cálculo de IMC com classificação automática
- ✅ Histórico completo de cálculos com paginação
- ✅ Exclusão de registros antigos
- ✅ Estatísticas personalizadas
- ✅ Proteção contra ataques (rate limiting, helmet, CORS)
- ✅ Validação de dados no cliente e servidor
- ✅ Sessões seguras
- ✅ Logs estruturados

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js v5** - Framework web
- **MySQL2** - Banco de dados com connection pooling
- **bcrypt** - Criptografia de senhas
- **express-validator** - Validação de dados
- **winston** - Sistema de logs
- **helmet** - Headers de segurança
- **express-rate-limit** - Proteção contra força bruta
- **cors** - Controle de acesso cross-origin
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilos
- **Vanilla JavaScript (ES6+)** - Lógica do cliente

## 📋 Pré-requisitos

- Node.js >= 14.x
- MySQL >= 5.7 ou 8.x
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/EversonRubira/FitCheck.git
cd FitCheck
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Copie o arquivo `.env.example` para `.env` e ajuste os valores:
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=fitcheck
PORT=3000
NODE_ENV=development
SESSION_SECRET=seu-secret-super-seguro-aqui
ALLOWED_ORIGINS=http://localhost:3000
```

### 4. Configure o banco de dados
Execute o script SQL para criar o banco e as tabelas:
```bash
mysql -u root -p < database/schema.sql
```

Ou manualmente:
```sql
CREATE DATABASE fitcheck;
USE fitcheck;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE imc_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    peso DECIMAL(5,2) NOT NULL,
    altura DECIMAL(3,2) NOT NULL,
    imc DECIMAL(5,2) NOT NULL,
    classificacao VARCHAR(50) NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 5. Inicie o servidor
```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
FitCheck/
├── database/
│   └── schema.sql          # Schema do banco de dados
├── middleware/
│   ├── auth.js            # Middleware de autenticação
│   └── validation.js      # Regras de validação
├── public/
│   ├── css/
│   │   └── style.css      # Estilos da aplicação
│   └── js/
│       ├── historico.js   # Lógica do histórico
│       ├── login.js       # Lógica de login
│       ├── register.js    # Lógica de registro
│       └── script.js      # Lógica do cálculo de IMC
├── routes/
│   ├── authRoutes.js      # Rotas de autenticação
│   └── imcRoutes.js       # Rotas de IMC
├── utils/
│   └── logger.js          # Configuração de logs
├── views/
│   ├── historico.html     # Página de histórico
│   ├── index.html         # Página principal (calculadora)
│   ├── login.html         # Página de login
│   └── register.html      # Página de registro
├── logs/                  # Logs da aplicação (gerado automaticamente)
├── .env                   # Variáveis de ambiente (NÃO versionar)
├── .env.example           # Exemplo de variáveis de ambiente
├── .gitignore            # Arquivos ignorados pelo Git
├── db.js                 # Configuração do banco de dados
├── package.json          # Dependências e scripts
├── README.md             # Este arquivo
└── server.js             # Arquivo principal do servidor
```

## 🔒 Segurança

- ✅ Senhas criptografadas com **bcrypt** (10 rounds)
- ✅ Proteção contra SQL Injection (queries parametrizadas)
- ✅ Rate limiting (5 tentativas de login a cada 15 minutos)
- ✅ Headers de segurança com **Helmet**
- ✅ Sessões seguras com httpOnly e sameSite cookies
- ✅ CORS configurado
- ✅ Validação de entrada no cliente e servidor
- ✅ Mensagens de erro genéricas (não revelam se usuário existe)

## 📡 API Endpoints

### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login
- `GET /auth/logout` - Fazer logout
- `GET /auth/me` - Obter dados do usuário logado

### IMC
- `POST /imc/registrar` - Registrar cálculo de IMC (requer autenticação)
- `GET /imc/historico?page=1&limit=10` - Obter histórico (requer autenticação)
- `DELETE /imc/deletar/:id` - Deletar registro (requer autenticação)
- `GET /imc/estatisticas` - Obter estatísticas (requer autenticação)

### Sistema
- `GET /health` - Health check do servidor

## 📊 Classificação de IMC

| IMC | Classificação |
|-----|--------------|
| < 18.5 | Magreza |
| 18.5 - 24.9 | Normal |
| 25.0 - 29.9 | Sobrepeso |
| ≥ 30.0 | Obesidade |

## 🚀 Próximas Funcionalidades

- [ ] Gráficos de evolução do IMC
- [ ] Metas personalizadas
- [ ] Exportação de dados (PDF, CSV)
- [ ] Integração com wearables
- [ ] Notificações e lembretes
- [ ] Modo escuro
- [ ] PWA (Progressive Web App)
- [ ] Multilíngue

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC.

## 👥 Autores

Desenvolvido por **Everson Rubira** – aluno de Programação Web no Instituto Politécnico de Setúbal.

- GitHub: [@EversonRubira](https://github.com/EversonRubira)

---

**Nota de Segurança**: Este projeto implementa as melhores práticas de segurança para aplicações web, mas sempre revise e ajuste conforme suas necessidades específicas antes de colocar em produção.



