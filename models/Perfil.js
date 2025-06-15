const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Perfil = sequelize.define('Perfil', {
  idade: DataTypes.INTEGER,
  altura: DataTypes.FLOAT,
  peso: DataTypes.FLOAT
});

// Relacionamento: um utilizador tem um perfil
User.hasOne(Perfil, {
  foreignKey: 'userId',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
Perfil.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

module.exports = Perfil;
