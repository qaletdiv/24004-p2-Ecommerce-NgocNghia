'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Product belongs to Category
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });
      
      // Product has many ProductImages
      Product.hasMany(models.ProductImage, {
        foreignKey: 'product_id',
        as: 'images'
      });
      
      // Product belongs to many Carts through ProductsCart
      Product.belongsToMany(models.Cart, {
        through: models.ProductsCart,
        foreignKey: 'product_id',
        as: 'carts'
      });
    }
  }
  
  Product.init({
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    product_price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    product_description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'category',
        key: 'category_id'
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true
  });
  
  return Product;
};