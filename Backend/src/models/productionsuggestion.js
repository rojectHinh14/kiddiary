"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductSuggestion extends Model {
    static associate(models) {}
  }
  ProductSuggestion.init(
    {
      mediaId: { type: DataTypes.INTEGER, allowNull: false },
      productName: DataTypes.STRING,
      productUrl: DataTypes.TEXT,
      categoryCode: DataTypes.STRING, // FK -> AllCode.keyMap
    },
    {
      sequelize,
      modelName: "ProductSuggestion",
      tableName: "ProductSuggestions",
    }
  );
  return ProductSuggestion;
};
