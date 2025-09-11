'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        account_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'account',
                key: 'account_id'
            }
        },
        profile_user_image: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        user_full_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        DOB: {
            type: DataTypes.DATE,
            allowNull: true
        },
        gender: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        phone_number: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        home_address: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        office_address: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: 'users',
        timestamps: false
    });

    User.associate = (models) => {
        User.belongsTo(models.Account, {
            foreignKey: 'account_id',
            as: 'account'
        });
        User.hasOne(models.Cart, {
            foreignKey: 'user_id',
            as: 'cart'
        });
        User.hasMany(models.Order, {
            foreignKey: 'user_id',
            as: 'orders'
        });
        User.hasMany(models.Payment, {
            foreignKey: 'user_id',
            as: 'payments'
        });
    };

    return User;
};