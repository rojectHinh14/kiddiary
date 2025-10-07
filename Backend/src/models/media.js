"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    static associate(models) {}
  }
  Media.init(
    {
      albumId: { type: DataTypes.INTEGER, allowNull: false },
      childId: DataTypes.INTEGER,
      fileUrl: DataTypes.TEXT,
      fileTypeCode: DataTypes.STRING, // FK -> AllCode.keyMap
      description: DataTypes.TEXT,
      aiTags: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Media",
      tableName: "Media",
    }
  );
  return Media;
};
