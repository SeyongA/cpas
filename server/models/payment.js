const { DataTypes } = require('sequelize');

const payment = (seq) => {
  return seq.define('payment', {
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'userId',
      },
    },
    paymentDate: {
      type: DataTypes.DATE, // DATE로 변경
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};

module.exports = payment;
