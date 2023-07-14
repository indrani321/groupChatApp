const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const UserGroup = sequelize.define('userGroup', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    
    
  });
  module.exports= UserGroup;