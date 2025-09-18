'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Order belongs to User
      Order.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      
      // Order has many OrderDetails
      Order.hasMany(models.OrderDetails, {
        foreignKey: 'order_id',
        as: 'orderDetails'
      });
    }
  }
  
  Order.init({
    order_id: {
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
    total_product_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_product_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true
  });
  
  return Order;
};