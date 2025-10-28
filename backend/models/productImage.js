'use strict'
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductImage extends Model {
        static associate (models) {

        }
    }

    ProductImage.init({
        product_image_id : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_image_link: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: 'ProductImage',
        tableName: 'product_image',
        timestamps: false,
    });
    return ProductImage;
}