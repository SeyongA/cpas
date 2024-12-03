'use strict';
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

db.User = require('./user')(sequelize); //user 테이블
db.Payment = require('./payment')(sequelize); //recipe 테이블
db.PaymentDetail = require('./paymentDetail')(sequelize); //review 테이블
db.Product = require('./product')(sequelize); //review 테이블


// 유저 : 레시피 / 1 : 다
db.User.hasMany(db.Payment, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.Payment.belongsTo(db.User, { foreignKey: 'userId', onDelete: 'CASCADE' });

// 결제내역 : 결제내역 상세 / 1 : 다
db.Payment.hasMany(db.PaymentDetail, { foreignKey: 'paymentId', onDelete: 'CASCADE' });
db.PaymentDetail.belongsTo(db.Payment, { foreignKey: 'paymentId', onDelete: 'CASCADE' });

// 상품 : 결제내역 상세  / 1 : 다
db.Product.hasMany(db.PaymentDetail, { foreignKey: 'productId', onDelete: 'CASCADE' });
db.PaymentDetail.belongsTo(db.Product, { foreignKey: 'productId', onDelete: 'CASCADE' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
