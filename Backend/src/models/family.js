"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Family extends Model {
    static associate(models) {}
  }
  Family.init(
    {
      familyName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Family",
      tableName: "Families",
    }
  );
  return Family;
};
