# 💪 FitCheck – Seu Assistente de Bem-Estar

**FitCheck** é uma aplicação web desenvolvida com Node.js, Express, EJS e MySQL, que permite que utilizadores registem e acompanhem hábitos diários de saúde, como sono, hidratação, humor, alimentação e atividade física. A aplicação diferencia entre utilizadores comuns e PRO, oferecendo funcionalidades exclusivas para quem deseja evoluir ainda mais!

---

## 🧭 Funcionalidades

### ✅ Funcionalidades Gerais
- Login e Registo de Utilizadores
- Criação de perfil com idade, altura e peso
- Cálculo automático do IMC com feedback personalizado
- Registo diário de:
  - Sono (horas e qualidade)
  - Consumo de água (ml)
  - Humor (1 a 5)
  - Alimentação
  - Atividade física e intensidade
- Consulta de registos por data
- Dashboard com resumo, feedback e ações rápidas

### 🔐 Permissões por Tipo de Utilizador

| Funcionalidade        | Comum 👤 | PRO ⭐ |
|-----------------------|:--------:|:------:|
| Criar Perfil          | ✅       | ✅     |
| Editar Perfil         | ❌       | ✅     |
| Ver Histórico         | ❌       | ✅     |
| Criar até 3 Registos  | ✅       | ✅     |
| Criar Registos Ilimitados | ❌    | ✅     |
| Metas de Bem-Estar    | ❌       | ✅     |

---

## 🧑‍💻 Tecnologias Utilizadas

- **Node.js**
- **Express.js**
- **EJS** (views dinâmicas)
- **MySQL** com **Sequelize ORM**
- **CSS Responsivo** com layout centrado e visual relaxante
- **Sessões (express-session)** para autenticação
- **bcrypt** para hash de senhas

---

## 🚀 Instalação e Execução

### 🔧 Requisitos

- Node.js (versão LTS)
- MySQL Server ou MariaDB
- Git (opcional)

### 📦 Passos

1. Clone o repositório:
```bash
git clone https://github.com/EversonRubira/FitCheck.git
cd FitCheck
````

Desenvolvido por Everson Rubira – aluno de Programação Web no Instituto Politécnico de Setúbal.



