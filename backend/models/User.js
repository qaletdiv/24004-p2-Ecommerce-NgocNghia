'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.Account, { 
                foreignKey: 'account_id',
                as: 'account'
            });
        }
    }

    User.init({
        user_full_name: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        profile_user_image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        DOB: {
            type: DataTypes.DATE,
            allowNull: true
        }, 
        gender: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'accounts',
                key: 'account_id'
            },
        }   
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users', 
        timestamps: false
    });
    return User;
};