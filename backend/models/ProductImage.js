'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) {
      // ProductImage belongs to Product
      ProductImage.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }
  
  ProductImage.init({
    product_image_id: {
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
    product_image_link: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ProductImage',
    tableName: 'product_image',
    timestamps: true
  });
  
  return ProductImage;
};