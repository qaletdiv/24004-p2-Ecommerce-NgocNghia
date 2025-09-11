module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        order_id: {
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
            allowNull: false
        },
        total_product_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: 'pending'
        }
    }, {
        tableName: 'orders',
        timestamps: false
    });

    Order.associate = (models) => {
        Order.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Order.hasMany(models.OrderDetails, {
            foreignKey: 'order_id',
            as: 'orderDetails'
        });
    };

    return Order;
};