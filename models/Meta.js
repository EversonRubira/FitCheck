const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Meta = sequelize.define('Meta', {
  pesoIdeal: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  sonoMinimo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  aguaDiariaMl: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// Relacionamento: um utilizador tem uma meta
User.hasOne(Meta, { foreignKey: 'userId' });
Meta.belongsTo(User, { foreignKey: 'userId' });

module.exports = Meta;
