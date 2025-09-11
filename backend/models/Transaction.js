module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        transaction_id: {
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
        transaction_amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transaction_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        tableName: 'transaction',
        timestamps: false
    });

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return Transaction;
};