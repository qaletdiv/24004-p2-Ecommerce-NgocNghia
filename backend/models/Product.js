'use strict';

const Product = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
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
            type: DataTypes.TEXT,
            allowNull: true
        },
        category_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'category',
                key: 'category_id'
            }
        }
    }, {
        tableName: 'products',
        timestamps: false
    });

    Product.associate = (models) => {
        Product.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category'
        });
        Product.hasMany(models.ProductImage, {
            foreignKey: 'product_id',
            as: 'images'
        });
        Product.hasMany(models.ProductsCart, {
            foreignKey: 'product_id',
            as: 'cartItems'
        });
        Product.hasMany(models.OrderDetails, {
            foreignKey: 'product_id',
            as: 'orderDetails'
        });
    };

    return Product;
};