"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      gender: DataTypes.STRING,
      image: DataTypes.STRING,
      roleId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
    }
  );
  return User;
};
