const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Note = require('./noteModel'); // Asegúrate de importar Note

const Horse = sequelize.define('Horse', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  birth: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  sex: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  fur: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  breed_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  image_profile: {
    type: DataTypes.STRING(50),
    allowNull: true,
  }
});

Horse.hasMany(Note, { foreignKey: 'horse_id' });

module.exports = Horse;