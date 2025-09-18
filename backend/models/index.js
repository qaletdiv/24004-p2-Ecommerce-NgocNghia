'use strict';

const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);


db.Account = require('./account')(sequelize, Sequelize);
db.User = require('./User')(sequelize, Sequelize);
db.Product = require('./Product')(sequelize, Sequelize);
db.Category = require('./Category')(sequelize, Sequelize);
db.ProductImage = require('./ProductImage')(sequelize, Sequelize);
db.Cart = require('./Cart')(sequelize, Sequelize);
db.ProductsCart = require('./ProductCart')(sequelize, Sequelize);
db.Order = require('./Order')(sequelize, Sequelize);
db.OrderDetails = require('./OrderDetails')(sequelize, Sequelize);
db.Payment = require('./Payment')(sequelize, Sequelize);
db.Transaction = require('./Transaction')(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;