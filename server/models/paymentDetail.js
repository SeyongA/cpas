const { DataTypes } = require('sequelize');

const paymentDetail = (seq) => {
  return seq.define('paymentDetail', {
    paymentDetailId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    paymentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'payments',
        key: 'paymentId',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'products',
        key: 'productId',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};

module.exports = paymentDetail;
