// seed.js – Cria um utilizador PRO de demonstração com 7 dias de registos realistas,
// para mostrar a aplicação sem precisar de inserir dados manualmente.
require('dotenv').config();

const bcrypt = require('bcrypt');
const sequelize = require('./config/database');
const User = require('./models/User');
const Perfil = require('./models/Perfil');
const Meta = require('./models/Meta');
const Registro = require('./models/Registro');

const DEMO_EMAIL = 'demo@fitcheck.com';
const DEMO_SENHA = 'demo1234';

const QUALIDADES_SONO = ['boa', 'regular', 'boa', 'má', 'regular', 'boa', 'excelente'];
const ATIVIDADES = [
  { tipo: 'caminhada', intensidade: 'leve' },
  { tipo: 'corrida', intensidade: 'intensa' },
  { tipo: 'musculação', intensidade: 'moderada' },
  { tipo: 'yoga', intensidade: 'leve' },
  { tipo: 'ciclismo', intensidade: 'moderada' },
  { tipo: 'descanso', intensidade: 'sem atividade' },
  { tipo: 'natação', intensidade: 'moderada' }
];

function aleatorioEntre(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  await sequelize.sync();

  const senhaHash = await bcrypt.hash(DEMO_SENHA, 10);

  const [usuario] = await User.findOrCreate({
    where: { email: DEMO_EMAIL },
    defaults: {
      nome: 'Utilizador Demo',
      email: DEMO_EMAIL,
      senha: senhaHash,
      tipo: 'pro'
    }
  });

  // Garante que o utilizador de demo está sempre PRO, com a senha certa e contador zerado
  usuario.senha = senhaHash;
  usuario.tipo = 'pro';
  usuario.ai_analysis_count = 0;
  await usuario.save();

  await Registro.destroy({ where: { userId: usuario.id } });
  await Perfil.destroy({ where: { userId: usuario.id } });
  await Meta.destroy({ where: { userId: usuario.id } });

  await Perfil.create({
    userId: usuario.id,
    idade: 29,
    altura: 1.75,
    peso: 74.5
  });

  await Meta.create({
    userId: usuario.id,
    pesoIdeal: 70,
    sonoMinimo: 7,
    aguaDiariaMl: 2000
  });

  const registros = [];
  for (let i = 6; i >= 0; i--) {
    const data = new Date();
    data.setDate(data.getDate() - i);
    const atividade = ATIVIDADES[6 - i];

    registros.push({
      userId: usuario.id,
      data: data.toISOString().slice(0, 10),
      horasSono: aleatorioEntre(5, 8),
      qualidadeSono: QUALIDADES_SONO[6 - i],
      aguaMl: aleatorioEntre(15, 25) * 100,
      humor: aleatorioEntre(2, 5),
      tipoAtividade: atividade.tipo,
      intensidade: atividade.intensidade,
      qualidadeAlimentacao: aleatorioEntre(2, 5)
    });
  }

  await Registro.bulkCreate(registros);

  console.log('Seed concluído com sucesso!');
  console.log(`Login demo: ${DEMO_EMAIL} / ${DEMO_SENHA}`);
}

seed()
  .catch(err => {
    console.error('Erro ao executar seed:', err);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
