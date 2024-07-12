const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Activity = require('./activityModel');

const Measurement = sequelize.define('Measurement', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  activity_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  horse_id: {
type: DataTypes.INTEGER,
    allowNull: false,
  },
  chucker_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  speed: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  distance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  acceleration: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  duration: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

Measurement.belongsTo(Activity, { foreignKey: 'activity_id' });

module.exports = Measurement;

