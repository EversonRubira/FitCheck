const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Registro = sequelize.define('Registro', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  horasSono: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  qualidadeSono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  aguaMl: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  humor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  tipoAtividade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  intensidade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  qualidadeAlimentacao: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  }
});

module.exports = Registro;
