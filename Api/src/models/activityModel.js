const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  type_activity_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'activityTypes',
      key: 'id',
    },
  },
  chukker_quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Activity;