'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      // Account has one User
      Account.hasOne(models.User, {
        foreignKey: 'account_id',
        as: 'user'
      });
    }
  }
  
  Account.init({
    account_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Account',
    tableName: 'account',
    timestamps: true
  });
  
  return Account;
};