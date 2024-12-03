const { DataTypes } = require('sequelize');

const product = (seq) => {
  return seq.define('product', {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    productName: {
      type: DataTypes.STRING(255), // 255로 변경
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};

module.exports = product;
