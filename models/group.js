const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Group = sequelize.define('group',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    groupname:{
        type: DataTypes.STRING,
        
        },
    
  
});

module.exports= Group;