'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // Category has many Products
      Category.hasMany(models.Product, {
        foreignKey: 'category_id',
        as: 'products'
      });
    }
  }
  
  Category.init({
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'category',
    timestamps: true
  });
  
  return Category;
};