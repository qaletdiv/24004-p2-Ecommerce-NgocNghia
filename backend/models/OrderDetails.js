'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderDetails extends Model {
    static associate(models) {
      // OrderDetails belongs to Order
      OrderDetails.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order'
      });
      
      // OrderDetails belongs to Product
      OrderDetails.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }
  
  OrderDetails.init({
    order_details_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'order_id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'product_id'
      }
    },
    product_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    product_category: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'OrderDetails',
    tableName: 'order_details',
    timestamps: true
  });
  
  return OrderDetails;
};