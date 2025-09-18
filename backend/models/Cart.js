'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // Cart belongs to User
      Cart.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      
      // Cart belongs to many Products through ProductsCart
      Cart.belongsToMany(models.Product, {
        through: models.ProductsCart,
        foreignKey: 'cart_id',
        as: 'products'
      });
    }
  }
  
  Cart.init({
    cart_id: {
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
    }
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'cart',
    timestamps: true
  });
  
  return Cart;
};