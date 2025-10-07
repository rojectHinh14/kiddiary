"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AllCode extends Model {
    static associate(models) {}
  }
  AllCode.init(
    {
      keyMap: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      valueEn: DataTypes.STRING,
      valueVi: DataTypes.STRING,
      orderBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "AllCode",
      tableName: "AllCodes",
    }
  );
  return AllCode;
};
