'use strict'

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.hasMany(models.ProductImage, {
                foreignKey: 'product_id',
                as: 'productImages'
            });
            Product.belongsTo(models.Category, {
                foreignKey: 'category_id',
                as: 'category'
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
            type: DataTypes.STRING,
        },
        product_price: {
            type: DataTypes.DOUBLE,
        },
        product_description: {
            type: DataTypes.TEXT,
        },
        category_id: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: false
    });
    return Product;
}