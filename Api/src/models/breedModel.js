const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Breed = sequelize.define('Breed', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
});

module.exports = Breed;