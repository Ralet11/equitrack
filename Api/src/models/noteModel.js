const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Horse = require('./horseModel');

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
 horse_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Horses',
        key: 'id',
      },
    },
});


module.exports = Note;
