'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductsCart extends Model {
    static associate(models) {
      // ProductsCart belongs to Product
      ProductsCart.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
      
      // ProductsCart belongs to Cart
      ProductsCart.belongsTo(models.Cart, {
        foreignKey: 'cart_id',
        as: 'cart'
      });
    }
  }
  
  ProductsCart.init({
    products_cart_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'product_id'
      }
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cart',
        key: 'cart_id'
      }
    },
    product_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ProductsCart',
    tableName: 'products_cart',
    timestamps: true
  });
  
  return ProductsCart;
};