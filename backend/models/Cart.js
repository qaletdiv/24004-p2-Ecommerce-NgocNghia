module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
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
            defaultValue: 0
        }
    }, {
        tableName: 'cart',
        timestamps: false
    });

    Cart.associate = (models) => {
        Cart.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Cart.hasMany(models.ProductsCart, {
            foreignKey: 'cart_id',
            as: 'cartItems'
        });
    };

    return Cart;
};