const { DataTypes } = require('sequelize');

const user = (seq) => {
    return seq.define('user', {
        userId : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true,
        },
        userName: {
            type: DataTypes.STRING(121),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255), // 255로 변경
            allowNull: false,
            unique: true,
        },
        phoneNumber: {
            type: DataTypes.STRING(255), // 255로 변경
            allowNull: false,
        }
    })
}

module.exports = user;
