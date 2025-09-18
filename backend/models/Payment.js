'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // Payment belongs to User
      Payment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  
  Payment.init({
    card_id: {
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
    card_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    card_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    card_password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    card_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payment',
    timestamps: true
  });
  
  return Payment;
};