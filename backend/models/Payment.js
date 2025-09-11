module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        card_id: {
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
        card_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        card_number: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        card_password: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        card_code: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        tableName: 'payment',
        timestamps: false
    });

    Payment.associate = (models) => {
        Payment.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return Payment;
};