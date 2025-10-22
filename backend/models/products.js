'use strict'

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.Category, {
                foreignKey: 'category_id',
                as: 'category'
            });
        }
    }

    Product.init({
        product_name: {
            type: DataTypes.STRING,
        },
        product_price: {
            type: DataTypes.TEXT,
        },
        product_description: {
            type: DataTypes.DOUBLE,
        },
        category_id: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        modelName: 'Product',
        tablename: 'products',
        timestamps: false
    });
    return Product;
}