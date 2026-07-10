const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Registro = require('./Registro');

const User = sequelize.define('User', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING,
    defaultValue: 'comum',
    allowNull: false
  },
  ai_analysis_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
});

User.hasMany(Registro, { foreignKey: 'userId', onDelete: 'CASCADE' });
Registro.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;
