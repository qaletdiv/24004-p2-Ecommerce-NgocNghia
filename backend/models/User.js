'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User belongs to Account
      User.belongsTo(models.Account, {
        foreignKey: 'account_id',
        as: 'account'
      });
      
      // User has many Orders
      User.hasMany(models.Order, {
        foreignKey: 'user_id',
        as: 'orders'
      });
      
      // User has one Cart
      User.hasOne(models.Cart, {
        foreignKey: 'user_id',
        as: 'cart'
      });
    }
  }
  
  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'account',
        key: 'account_id'
      }
    },
    profile_user_image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_full_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DOB: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    home_address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    office_address: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
  });
  
  return User;
};