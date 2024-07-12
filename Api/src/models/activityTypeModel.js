const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const ActivityType = sequelize.define('ActivityType', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
});

module.exports = ActivityType;