'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Account extends Model {
        static associate(models) {
            Account.hasOne(models.User, { 
                foreignKey: 'account_id', 
                as: 'user'  
            });
        }
    }

    Account.init({
        account_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        account_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
        }, 
        }, {    
        sequelize,
        modelName: 'Account',
        tableName: 'account',
        timestamps: false,
        defaultScope: {
            /// No return password
            attributes: { exclude: ['password'] }
        },
        scopes: {
            withPassword: {
                attributes: {},
            }
        }
});
    return Account;
};