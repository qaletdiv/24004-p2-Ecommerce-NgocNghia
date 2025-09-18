'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // Transaction belongs to User
      Transaction.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  
  Transaction.init({
    transaction_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    transaction_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transaction',
    timestamps: true
  });
  
  return Transaction;
};