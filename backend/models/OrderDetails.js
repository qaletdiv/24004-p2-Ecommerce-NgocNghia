module.exports = (sequelize, DataTypes) => {
    const OrderDetails = sequelize.define('OrderDetails', {
        order_details_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'order_id'
            }
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'product_id'
            }
        },
        product_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_price: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        product_category: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: 'order_details',
        timestamps: false
    });

    OrderDetails.associate = (models) => {
        OrderDetails.belongsTo(models.Order, {
            foreignKey: 'order_id',
            as: 'order'
        });
        OrderDetails.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
    };

    return OrderDetails;
};