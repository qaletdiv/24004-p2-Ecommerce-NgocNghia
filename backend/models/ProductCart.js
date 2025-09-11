module.exports = (sequelize, DataTypes) => {
    const ProductsCart = sequelize.define('ProductsCart', {
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
            allowNull: false,
            defaultValue: 1
        }
    }, {
        tableName: 'products_cart',
        timestamps: false
    });

    ProductsCart.associate = (models) => {
        ProductsCart.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
        ProductsCart.belongsTo(models.Cart, {
            foreignKey: 'cart_id',
            as: 'cart'
        });
    };

    return ProductsCart;
};