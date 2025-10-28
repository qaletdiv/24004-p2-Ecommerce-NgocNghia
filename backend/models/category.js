'use strict'

const {Model} = require ('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate (models) {
            Category.hasMany(models.Product, {
                foreignKey: 'category_id',
                as: 'product'
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
            type: DataTypes.STRING,
        }
    }, {
        sequelize,
        modelName: 'Category',
        tableName: 'category',
        timestamps: false
    });
    return Category;
};