const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./userModel');
const Horse = require('./horseModel');

const UserHorse = sequelize.define('UserHorse', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  horse_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

UserHorse.belongsTo(User, { foreignKey: 'user_id' });
UserHorse.belongsTo(Horse, { foreignKey: 'horse_id' });

module.exports = UserHorse;